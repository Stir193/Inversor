#!/bin/bash
# create_repo.sh - initializes local git repo and prints the commands to create remote on GitHub

if [ ! -d .git ]; then
  git init
  git add .
  git commit -m "Initial commit - Inversor MVP"
  echo "Local git repo initialized and committed."
else
  echo "Git repo already initialized."
fi

echo ""
echo "To push to GitHub:"
echo "1) Create a repo on GitHub (do not initialize with README)."
echo "2) Run the following commands (replace YOUR_REMOTE_URL):"
echo "   git remote add origin YOUR_REMOTE_URL"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "You can create a GitHub repo from the command line (if gh CLI installed):"
echo "   gh repo create your-username/inversor --public --source=. --remote=origin --push"
