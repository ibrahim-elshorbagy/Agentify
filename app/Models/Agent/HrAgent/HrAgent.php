<?php

namespace App\Models\Agent\HrAgent;

use Illuminate\Database\Eloquent\Model;

class HrAgent extends Model
{
  protected $table = 'hr_agent';
  protected $guarded = ['id'];

  public $timestamps = false;
  
}
