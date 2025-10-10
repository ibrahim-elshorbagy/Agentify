// ORIGINAL SECTION PARSER (restored) + added identity extraction (candidate_name, email_address, contact_number)
// + fallback section grab if primary regex misses (guards against model formatting quirks)

const SECTION_CONFIG = {
  educationalQualifications: [
    'Educational Qualifications',
    'Education',
    'Academic Background',
    'Qualifications'
  ],
  jobHistory: [
    'Job History',
    'Work History',
    'Employment History',
    'Professional Experience',
    'Experience'
  ],
  skillSet: [
    'Skill Set',
    'Skills',
    'Technical Skills',
    'Core Skills'
  ],
  candidateEvaluation: [
    'Candidate Evaluation',
    'Evaluation',
    'Assessment',
    'Reviewer Notes',
    'Summary'
  ]
};

function escapeRe(s){return s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');}

const ALL_ALIAS_TO_FIELD = {};
Object.entries(SECTION_CONFIG).forEach(([field, aliases])=>{
  aliases.forEach(a=>{ALL_ALIAS_TO_FIELD[a.toLowerCase()] = field;});
});
const ALL_ALIASES = Object.values(SECTION_CONFIG).flat();
const ALL_ALIASES_PATTERN = ALL_ALIASES.map(escapeRe).join('|');

// Headings either occupy a whole line or are immediately followed by a newline.
// (Same as original working version)
const GLOBAL_HEADING_REGEX = new RegExp(
  (^\\s{0,3}(?:#{0,3}\\s*)?(${ALL_ALIASES_PATTERN})(?:\\s*[:\\-])?\\s*$)|(${ALL_ALIASES_PATTERN})(?=\\s*[:\\-]?\\s*\\r?\\n),
  'gim'
);

function looseSectionExtract(text){
  const matches=[];
  let m;
  while((m = GLOBAL_HEADING_REGEX.exec(text))!==null){
    const alias = (m[2] || m[3] || '').trim();
    const matchText = m[0] || '';
    const aliasIndexInMatch = matchText.toLowerCase().indexOf(alias.toLowerCase());
    const index = m.index + (aliasIndexInMatch >= 0 ? aliasIndexInMatch : 0);
    matches.push({alias, index, end: GLOBAL_HEADING_REGEX.lastIndex});
  }
  const sections={};
  for(let i=0;i<matches.length;i++){
    const cur=matches[i];
    const next=matches[i+1];
    const field=ALL_ALIAS_TO_FIELD[cur.alias.toLowerCase()];
    if(sections[field]) continue; // keep first occurrence
    const body=text.slice(cur.end, next?next.index:text.length)
      .replace(/^[ \t]*[\r\n]+/,'')
      .trim();
    sections[field]=body||null;
  }
  return sections;
}

// Fallback: if a section came back null, try a more permissive scan that allows "Heading: content starts right away"
function fallbackSection(text, targetField){
  const aliases = SECTION_CONFIG[targetField];
  if(!aliases) return null;

  // Build pattern to locate any alias (case-insensitive) at start of line with optional punctuation
  // Capture everything until next alias heading or end.
  const allNextAliases = ALL_ALIASES.map(escapeRe).join('|');
  const pattern = new RegExp(
    '^\\s*(?:' + aliases.map(escapeRe).join('|') + ')\\s*[:\\-]?\\s*\\r?\\n?' + // the heading
    '([\\s\\S]?)(?=^\\s(?:' + allNextAliases + ')\\s*[:\\-]?\\s*(?:\\r?\\n|$)|$)',
    'im'
  );
  const m = pattern.exec(text);
  if(!m) return null;
  const body = (m[1]||'').trim();
  return body || null;
}

function extractScore(source){
  if(!source) return null;
  const r1=/\bScore(?:\s*Overall)?\s*[:=\-]\s*(\d{1,2}\s*\/\s*10)\b/i;
  const r2=/\bScore(?:\s*Overall)?\s*[:=\-]?\s*(\d{1,2})\s*(?:\/|of)\s*10\b/i;
  let m=r1.exec(source)||r2.exec(source);
  if(!m) return null;
  let val=m[1].replace(/\s+/g,'');
  if(!val.includes('/')) val = ${val}/10;
  return val;
}

// Robust justification extractor (unchanged)
function extractJustification(source){
  if(!source) return null;
  const label=/\b(Justification|Rationale|Reasoning|Explanation)\s*[:\-]\s*([\s\S]+)/i;
  const lm=label.exec(source);
  if(lm) return lm[2].trim();
  const afterScore=source.replace(/^.\bScore\b.$/gim,'').trim();
  if(afterScore.split(/\s+/).length>=5) return afterScore;
  return null;
}

// ---------- Identity extractors (added) ----------
function extractEmail(text){
  if(!text) return null;
  const m=text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  return m ? m[0].trim() : null;
}

function extractPhone(text){
  if(!text) return null;
  const phoneRegex=/(\+\d{1,3}[\s\-]?)?(?:\(?\d{2,4}\)?[\s\-]?){2,5}\d{2,4}/g;
  const candidates=[];
  let m;
  while((m=phoneRegex.exec(text))!==null){
    const raw=m[0];
    const digits=raw.replace(/[^\d+]/g,'');
    const core=digits.replace(/^\+/, '');
    if(core.length>=10 && core.length<=15){
      candidates.push(digits.startsWith('+')?digits:+${core});
    }
  }
  return candidates.length?candidates[0]:null;
}

function extractName(text){
  if(!text) return null;
  // Look only at first ~40 lines for the name (typical CV header area)
  const lines=text.split(/\r?\n/).slice(0,40).map(l=>l.trim()).filter(Boolean);
  for(const line of lines){
    if(/@|www|http/i.test(line)) continue;
    if(/\b(curriculum|resume|cv)\b/i.test(line)) continue;
    if(line.length>100) continue;

    // Remove leading label "Candidate Name:" or "Name:"
    const cleaned=line.replace(/^(candidate\s*name|name)\s*[:\-]\s*/i,'').trim();

    // Require at least two capitalized words (simple heuristic)
    const words=cleaned.split(/\s+/);
    const capWords=words.filter(w=>/^[A-Z][a-z'’.-]{1,}$/.test(w));
    if(capWords.length>=2){
      return cleaned.replace(/\s+/g,' ');
    }
  }
  return null;
}

// Main extraction
function extractCandidateData(text){
  if(!text || typeof text!=='string'){
    return {
      candidate_name:null,
      email_address:null,
      contact_number:null,
      educationalQualifications:null,
      jobHistory:null,
      skillSet:null,
      score:null,
      justification:null
    };
  }

  // Primary (original) section parsing
  const sections=looseSectionExtract(text);

  // Fallbacks only if primary missed a section
  if(!sections.educationalQualifications){
    sections.educationalQualifications = fallbackSection(text, 'educationalQualifications');
  }
  if(!sections.jobHistory){
    sections.jobHistory = fallbackSection(text, 'jobHistory');
  }
  if(!sections.skillSet){
    sections.skillSet = fallbackSection(text, 'skillSet');
  }

  const evaluation = sections.candidateEvaluation || '';
  const score = extractScore(evaluation || text);
  const justification = extractJustification(evaluation || text);

  return {
    candidate_name: extractName(text),
    email_address: extractEmail(text),
    contact_number: extractPhone(text),
    educationalQualifications: sections.educationalQualifications || null,
    jobHistory: sections.jobHistory || null,
    skillSet: sections.skillSet || null,
    score,
    justification
  };
}

// ---- Gmail payload helper (unchanged) ----
function getPlainTextFromGmailPayload(payload){
  if(!payload) return null;
  function walk(part){
    if(!part) return [];
    const out=[];
    if(part.mimeType==='text/plain' && part.body && part.body.data){
      try{
        const decoded=Buffer.from(
          part.body.data.replace(/-/g,'+').replace(/_/g,'/'),
          'base64'
        ).toString('utf8');
        out.push(decoded);
      }catch(e){}
    }
    if(part.parts) part.parts.forEach(p=>out.push(...walk(p)));
    return out;
  }
  const arr=walk(payload);
  return arr.length?arr.join('\n\n'):null;
}

return items.map(item=>{
  const raw =
    getPlainTextFromGmailPayload(item.json.payload) ||
    item.json.message?.content ||
    item.json.body ||
    item.json.text ||
    item.json.snippet ||
    '';
  const extracted = extractCandidateData(raw);
  return {
    json:{
      ...item.json,
      cvRawTextLength: raw.length,
      ...extracted
    },
    binary:item.binary
  };
});
