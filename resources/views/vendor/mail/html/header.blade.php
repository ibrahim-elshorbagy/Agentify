@props(['url'])
<tr>
<td class="header">
<a href="{{ $url }}" style="display: inline-block;">
@if (trim($slot) === config('app.name') || trim($slot) === 'Agentify')
<div style="font-size: 24px; font-weight: bold; color: #3490dc;">Agentify</div>
@else
{!! $slot !!}
@endif
</a>
</td>
</tr>
