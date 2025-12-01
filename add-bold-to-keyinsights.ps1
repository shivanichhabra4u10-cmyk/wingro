# Script to add bold formatting to key phrases in keyInsight fields
# Only modifies keyInsight content, preserves everything else

$jsonPath = "client\src\data\DIGITAL-TWIN-SCORING-LOGIC.json"
$content = Get-Content $jsonPath -Raw

# Define patterns to make bold - these are high-impact phrases
$patterns = @(
    # Core identity and position statements
    @{ Pattern = 'You''re in a strong position'; Bold = '**You''re in a strong position**' }
    @{ Pattern = 'You''re not disconnected from purpose'; Bold = '**You''re not disconnected from purpose**' }
    @{ Pattern = 'You''re not disengaged — you''re under-expressed'; Bold = '**You''re not disengaged — you''re under-expressed**' }
    @{ Pattern = 'You are not in crisis — you are in transition'; Bold = '**You are not in crisis — you are in transition**' }
    
    # Key revelations
    @{ Pattern = 'That tells us 3 things:'; Bold = '**That tells us 3 things:**' }
    @{ Pattern = 'This tells us:'; Bold = '**This tells us:**' }
    @{ Pattern = 'This reveals'; Bold = '**This reveals**' }
    @{ Pattern = 'This signals'; Bold = '**This signals**' }
    @{ Pattern = 'What This Means'; Bold = '**What This Means**' }
    @{ Pattern = 'What This Strength'; Bold = '**What This Strength**' }
    
    # Core capabilities and distinctions  
    @{ Pattern = 'That''s not a preference\.\\nThat''s a competitive advantage\.'; Bold = '**That''s not a preference.**\\n**That''s a competitive advantage.**' }
    @{ Pattern = 'This is not administrative support\.\\nIt is strategic operational intelligence\.'; Bold = '**This is not administrative support.**\\n**It is strategic operational intelligence.**' }
    @{ Pattern = 'You are at your best when'; Bold = '**You are at your best when**' }
    @{ Pattern = 'You are not just a doer — you are a creator'; Bold = '**You are not just a doer — you are a creator**' }
    
    # Key conclusions and insights
    @{ Pattern = 'you''ve crossed the first big milestone'; Bold = '**you''ve crossed the first big milestone**' }
    @{ Pattern = 'Alignment isn''t the peak — it''s the launchpad'; Bold = '**Alignment isn''t the peak — it''s the launchpad**' }
    @{ Pattern = 'Alignment \+ Structure = Career acceleration'; Bold = '**Alignment + Structure = Career acceleration**' }
    @{ Pattern = 'You''re close\. You just haven''t created a repeatable system'; Bold = '**You''re close. You just haven''t created a repeatable system**' }
    @{ Pattern = 'when meaning becomes consistent, growth becomes continuous'; Bold = '**when meaning becomes consistent, growth becomes continuous**' }
    
    # Risk statements
    @{ Pattern = 'This is a career risk zone'; Bold = '**This is a career risk zone**' }
    @{ Pattern = 'growth is invisible'; Bold = '**growth is invisible**' }
    @{ Pattern = 'You are contributing — but not evolving'; Bold = '**You are contributing — but not evolving**' }
    
    # Strategic statements
    @{ Pattern = 'This provides acceleration without disruption'; Bold = '**This provides acceleration without disruption**' }
    @{ Pattern = 'This prevents slow decline'; Bold = '**This prevents slow decline**' }
    @{ Pattern = 'This converts'; Bold = '**This converts**' }
    
    # Gaps and transitions
    @{ Pattern = 'gap between capability and expression'; Bold = '**gap between capability and expression**' }
    @{ Pattern = 'You are transitioning from:'; Bold = '**You are transitioning from:**' }
    @{ Pattern = 'your environment benefits more from your capability than you benefit from the environment'; Bold = '**your environment benefits more from your capability than you benefit from the environment**' }
    
    # High-impact statements about strengths
    @{ Pattern = 'When people grow because of you, you grow too'; Bold = '**When people grow because of you, you grow too**' }
    @{ Pattern = 'Where others see confusion, you see structure'; Bold = '**Where others see confusion, you see structure**' }
    @{ Pattern = 'You think beyond today'; Bold = '**You think beyond today**' }
    @{ Pattern = 'You accelerate in the right company'; Bold = '**You accelerate in the right company**' }
    @{ Pattern = 'Your environment must match your ambition'; Bold = '**Your environment must match your ambition**' }
)

# Apply pattern replacements
foreach ($p in $patterns) {
    $content = $content -replace [regex]::Escape($p.Pattern), $p.Bold
}

# Save the modified content
$content | Set-Content $jsonPath -NoNewline

Write-Host "✓ Bold formatting added to key phrases in keyInsight fields" -ForegroundColor Green
Write-Host "  Total patterns applied: $($patterns.Count)" -ForegroundColor Cyan
