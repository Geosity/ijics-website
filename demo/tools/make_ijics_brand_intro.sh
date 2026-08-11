#!/usr/bin/env bash
set -euo pipefail

project_dir="$(cd "$(dirname "$0")/../.." && pwd)"
card_svg="$project_dir/demo/assets/ijics-brand-intro-card.svg"
output_dir="$project_dir/demo/media"
output="$output_dir/ijics-brand-intro-5s.mp4"
card_png="$output_dir/ijics-brand-intro-card.png"

mkdir -p "$output_dir"

rsvg-convert -w 1920 -h 1080 "$card_svg" -o "$card_png"

ffmpeg -y \
  -loop 1 -framerate 30 -i "$card_png" \
  -f lavfi -i "sine=frequency=392:sample_rate=48000:duration=5" \
  -f lavfi -i "sine=frequency=587.33:sample_rate=48000:duration=5" \
  -filter_complex "
    [0:v]
      scale=1980:1114,
      zoompan=z='min(zoom+0.00022,1.025)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s=1920x1080:fps=30,
      fade=t=in:st=0:d=0.35,
      fade=t=out:st=4.55:d=0.45
      [v];
    [1:a]volume=0.045,afade=t=in:st=0:d=0.35,afade=t=out:st=1.5:d=1.2[a1];
    [2:a]volume=0.025,adelay=520|520,afade=t=in:st=0.52:d=0.35,afade=t=out:st=2.0:d=1.2[a2];
    [a1][a2]amix=inputs=2:duration=longest,atrim=duration=5[a]
  " \
  -map "[v]" -map "[a]" \
  -t 5 \
  -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p \
  -c:a aac -b:a 160k -movflags +faststart \
  "$output"

ffprobe -v error \
  -show_entries format=duration,size:stream=codec_name,width,height,r_frame_rate \
  -of default=noprint_wrappers=1 \
  "$output"

echo "$output"
