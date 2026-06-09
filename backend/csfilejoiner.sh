#!/bin/bash

OUTPUT="csfiles.txt"

[ -f "$OUTPUT" ] && rm "$OUTPUT"

find . -type f -name "*.cs" | while read -r file; do
    echo "--- $(basename "$file") ---" >> "$OUTPUT"
    cat "$file" >> "$OUTPUT"
    echo "" >> "$OUTPUT"
done

echo "Done! Result saved to $OUTPUT"
