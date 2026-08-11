#!/usr/bin/env bash
set -euo pipefail

project_dir="$(cd "$(dirname "$0")/../.." && pwd)"
asset_dir="$project_dir/demo/assets"
media_dir="$project_dir/demo/media"
psd="$asset_dir/ijics-logo-current.psd"
clean_logo="$asset_dir/ijics-logo-symbol-clean.png"
card_svg="$asset_dir/ijics-brand-intro-vertical.svg"
card_png="$media_dir/ijics-brand-intro-vertical-card.png"
voice_audio="$media_dir/ijics-brand-voice-energetic.mp3"
output="$media_dir/ijics-brand-intro-vertical-6s.mp4"
output_tmp="$media_dir/.ijics-brand-intro-vertical-6s.tmp.mp4"

mkdir -p "$media_dir"

# Extract only the graphical mark from the supplied PSD. The Chinese and English
# lines begin below this crop and are deliberately excluded.
ffmpeg -y -i "$psd" -vf "crop=1900:1200:231:180,scale=1200:-1" -frames:v 1 -update 1 "$clean_logo"

rsvg-convert -w 1080 -h 1920 "$card_svg" -o "$card_png"

if [[ ! -s "$voice_audio" ]]; then
  echo "Missing energetic neural voice track: $voice_audio" >&2
  exit 1
fi

ffmpeg -y \
  -loop 1 -framerate 30 -i "$card_png" \
  -i "$voice_audio" \
  -filter_complex "
    [0:v]
      scale=1112:1978,
      zoompan=z='min(zoom+0.00024,1.030)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s=1080x1920:fps=30,
      fade=t=in:st=0:d=0.24,
      fade=t=out:st=5.58:d=0.42
      [v];
    [1:a]
      asetpts=PTS-STARTPTS,
      adelay=120|120,
      highpass=f=90,
      equalizer=f=2600:t=q:w=1.2:g=1.8,
      acompressor=threshold=0.12:ratio=1.8:attack=6:release=70:makeup=1.25,
      volume=1.08,
      afade=t=in:st=0.12:d=0.06,
      afade=t=out:st=5.45:d=0.30
      [a]
  " \
  -map "[v]" -map "[a]" \
  -t 6 \
  -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p \
  -c:a aac -b:a 192k -ar 48000 -movflags +faststart \
  "$output_tmp"

mv -f "$output_tmp" "$output"

ffprobe -v error \
  -show_entries format=duration,size:stream=codec_name,width,height,r_frame_rate \
  -of default=noprint_wrappers=1 \
  "$output"

echo "$output"
