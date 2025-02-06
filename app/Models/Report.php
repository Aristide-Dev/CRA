<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Report extends Model
{
    protected $fillable = [
        'user_id',
        'title',
        'content',
        'status'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function managers()
    {
        return $this->belongsToMany(User::class, 'report_manager')
            ->withPivot('status', 'feedback')
            ->withTimestamps();
    }
} 