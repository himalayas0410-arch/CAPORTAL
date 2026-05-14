import os
import re

def fix_links(directory):
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith(".html"):
                filepath = os.path.join(root, file)
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # Fix corrupted style.css links
                content = content.replace('style.css\\">', 'style.css">')
                content = content.replace('responsive.css\\">', 'responsive.css">')
                content = content.replace('style.css\\"', 'style.css"')
                content = content.replace('responsive.css\\"', 'responsive.css"')
                content = content.replace('rel=\\"stylesheet\\"', 'rel="stylesheet"')
                content = content.replace('href=\\"', 'href="')
                content = content.replace('\\">', '">')
                
                # Standardize the link block if it's messy
                # Matches: <link rel="stylesheet" href="...style.css"><link rel="stylesheet" href="...responsive.css">
                # Even if there are extra characters or quotes
                
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(content)

if __name__ == "__main__":
    fix_links("g:/CAwebisteCA/gstin-verify-portal/converted")
