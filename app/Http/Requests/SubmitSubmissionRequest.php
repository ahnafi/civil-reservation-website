<?php

namespace App\Http\Requests;

use App\Models\Test;
use Illuminate\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;

class SubmitSubmissionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'company_name' => 'required|string|max:255',
            'project_name' => 'required|string|max:255',
            'project_address' => 'required|string|max:255',
            'test_submission_date' => 'required|date_format:Y-m-d',
            'user_note' => 'nullable|string|max:512',

            // submission_tests is required if submission_packages is not present
            'submission_tests' => 'required_without:submission_packages|array',
            'submission_tests.*.test_id' => 'required|exists:tests,id',
            'submission_tests.*.unit' => 'required|integer',

            // submission_packages is required if submission_tests is not present
            'submission_packages' => 'required_without:submission_tests|array',
            'submission_packages.*.package_id' => 'required|exists:packages,id',
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function ($validator) {
            $tests = $this->input('submission_tests', []);

            $testIds = collect($tests)->pluck('test_id')->filter()->toArray();

            $loadedTests = Test::with('category')->whereIn('id', $testIds)->get()->keyBy('id');

            foreach ($tests as $index => $submissionTest) {
                $test = $loadedTests->get($submissionTest['test_id'] ?? null);

                if ($test && isset($submissionTest['unit'])) {
                    if ($submissionTest['unit'] < $test->minimum_unit) {
                        $validator->errors()->add(
                            "submission_tests.$index.unit",
                            "Jumlah pengajuan untuk pengujian {$test->name} tidak boleh kurang dari {$test->minimum_unit} {$test->category->name}"
                        );
                    }
                }
            }
        });
    }

    public function attributes(): array
    {
        return [
            'test_submission_date' => 'Tanggal pengajuan uji',
            'submission_tests.*.unit' => 'Jumlah unit pengujian',
            'submission_tests.*.test_id' => 'Jenis pengujian',
            'submission_packages.*.package_id' => 'Paket pengujian',
        ];
    }

}
