<?php

namespace App\Models\Agent\EmailAgent;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
  use HasFactory;

  protected $guarded = ['id'];
  public function responses()
  {
    return $this->hasMany(MessageResponse::class);
  }


}
