<?php

namespace App\Models\User\Agents\ReportAgent;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class ReportFile extends Model
{
    protected $fillable = [
        'user_id',
        'path',
        'original_name',
        'file_size',
        'mime_type',
    ];

    /**
     * Get the user that owns the report file.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the file name from the path
     */
    public function getFileNameAttribute()
    {
        return basename($this->path);
    }

    /**
     * Get the file extension
     */
    public function getExtensionAttribute()
    {
        return pathinfo($this->path, PATHINFO_EXTENSION);
    }
}
