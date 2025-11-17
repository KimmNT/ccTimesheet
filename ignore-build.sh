#!/bin/bash

if [ "$VERCEL_GIT_COMMIT_REF" != "main" ]; then
  echo "🛑 - Build cancelled (not main branch)"
  exit 0   # skip build
fi

exit 1     # build continues normally