<?php
/**
 * Strip all comments (T_COMMENT and T_DOC_COMMENT) from PHP files safely.
 * Uses PHP's tokenizer to avoid breaking string literals or other syntax.
 */
function stripPhpComments(string $code): string {
    $tokens = @token_get_all($code);
    $result = '';
    foreach ($tokens as $token) {
        if (is_array($token)) {
            // T_COMMENT = // and # and /* */ (non-docblock)
            // T_DOC_COMMENT = /** */ (docblock)
            // Strip both
            if (in_array($token[0], [T_COMMENT, T_DOC_COMMENT])) {
                // Replace comment content with whitespace to preserve line numbers
                // but don't leave too many blank lines
                $lines = substr_count($token[1], "\n");
                if ($lines > 0) {
                    $result .= str_repeat("\n", $lines);
                }
                // else: single-line comment, just remove it
            } else {
                $result .= $token[1];
            }
        } else {
            $result .= $token;
        }
    }
    return $result;
}

// Process all PHP files in the project
$projectRoot = __DIR__;
$files = new RecursiveIteratorIterator(
    new RecursiveDirectoryIterator($projectRoot, RecursiveDirectoryIterator::SKIP_DOTS),
    RecursiveIteratorIterator::LEAVES_ONLY
);

$processed = 0;
$skipped = 0;
$errors = [];

foreach ($files as $file) {
    $path = $file->getPathname();
    
    // Only process .php files
    if ($file->getExtension() !== 'php') {
        continue;
    }
    
    // Skip the vendor directory and node_modules
    if (str_contains($path, '/vendor/') || str_contains($path, '/node_modules/')) {
        continue;
    }
    
    // Skip this script itself
    if (str_contains($path, 'strip_comments.php')) {
        continue;
    }
    
    $original = @file_get_contents($path);
    if ($original === false) {
        $errors[] = "Cannot read: $path";
        continue;
    }
    
    // Check if file has any comments
    if (!str_contains($original, '//') && !str_contains($original, '/*') && !str_contains($original, '#')) {
        $skipped++;
        continue;
    }
    
    $stripped = stripPhpComments($original);
    
    // Only write if something changed
    if ($stripped !== $original) {
        $result = @file_put_contents($path, $stripped);
        if ($result === false) {
            $errors[] = "Cannot write: $path";
        } else {
            $processed++;
        }
    }
}

echo "Processed: $processed files\n";
echo "Skipped (no comments): $skipped files\n";
if ($errors) {
    echo "Errors:\n";
    foreach ($errors as $e) {
        echo "  - $e\n";
    }
}
