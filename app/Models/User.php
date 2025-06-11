<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Filament\Models\Contracts\FilamentUser;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Http\Request;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable implements FilamentUser, MustVerifyEmail
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'identity',
        'role',
        'photo'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */

    protected static function boot(): void
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->photo)) {
                $model->photo = 'user_profile\/default-user_profile.jpg';
            }
        });

        static::created(function ($user) {
            if ($user->role !== null) {
                return;
            }

            if ($user->email) {
                $email = strtolower($user->email);

                if (str_ends_with($email, 'unsoed.ac.id') || str_ends_with($email, '@mhs.unsoed.ac.id')) {
                    $user->role = 'internal';
                } else {
                    $user->role = 'external';
                }
                $user->save();
            }
        });

        static::updating(function ($model) {
            if ($model->isDirty('photo')) {
                $oldImage = $model->getOriginal('photo');
                $newImage = $model->photo;

                if (
                    $oldImage &&
                    $oldImage !== $newImage &&
                    $oldImage !== 'user_profile\/default-user_profile.jpg' &&
                    Storage::disk('public')->exists($oldImage)
                ) {
                    Storage::disk('public')->delete($oldImage);
                }
            }
        });

        static::deleting(function ($model) {
            if (
                $model->photo &&
                $model->photo !== 'user_profile\/default-user_profile.jpg' &&
                Storage::disk('public')->exists($model->photo)
            ) {
                Storage::disk('public')->delete($model->photo);
            }
        });
    }



    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'identity' => 'encrypted',
            'phone' => 'encrypted'
        ];
    }

    public function submissions(): HasMany
    {
        return $this->hasMany(Submission::class);
    }

    public function canAccessPanel(\Filament\Panel $panel): bool
    {
        return $this->role == "admin" || $this->role == "superadmin";
    }

}
