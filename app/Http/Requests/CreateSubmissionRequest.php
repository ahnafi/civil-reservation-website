<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\UploadedFile;
use Illuminate\Validation\Rules\File;

class CreateSubmissionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user() !== null && $this->user()->role !== "admin";
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            "company_name" => "nullable|string",
            "project_name" => "required|string",
            "project_address" => "required|string",
            "document" => "nullable|file|mimes:pdf,doc,docx,xls,xlsx|max:2048",
            "note" => "nullable|string",
            "packages" => "nullable|array",
            "packages.*" => "required|integer|exists:packages,id",
            "tests" => "nullable|array",
            "tests.*" => "required|array",
            "tests.*.id" => "required|integer|exists:tests,id",
            "tests.*.quantity" => "required|integer|min:1",
        ];
    }
}
