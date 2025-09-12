<?php

namespace App\Models\Agent\EmailAgent;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MessageResponse extends Model
{
  use HasFactory;
  protected $guarded = ['id'];

  public function message()
  {
    return $this->belongsTo(Message::class);
  }

}
