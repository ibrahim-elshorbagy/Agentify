<?php

namespace App\Models\Agent\EmailAgent;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
  use HasFactory;

  protected $guarded = ['id'];

  protected $casts = [
    'received_at' => 'datetime',
  ];

  public function responses()
  {
    return $this->hasMany(MessageResponse::class, 'message_id', 'message_id');
  }


}
