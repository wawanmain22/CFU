<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();
        $path = $request->path();

        // Check if accessing staff dashboard
        if (str_starts_with($path, 'staff')) {
            if ($user->role !== 'staff') {
                abort(403, 'Unauthorized access. Staff only.');
            }
        }
        
        // Check if accessing student dashboard
        if (str_starts_with($path, 'student')) {
            if ($user->role !== 'student') {
                abort(403, 'Unauthorized access. Students only.');
            }
        }

        return $next($request);
    }
}
