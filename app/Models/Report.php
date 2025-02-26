<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Report extends Model
{
    /** @use HasFactory<\Database\Factories\ReportFactory> */
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'title',
        'content',
        'status'
    ];

    /**
     * Undocumented function
     *
     * @return void
     */
    public function managers()
    {
        return $this->belongsToMany(User::class, 'report_manager')
            ->withPivot('status', 'feedback')
            ->withTimestamps();
    }
}
