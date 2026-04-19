import re
with open(r'c:\Users\naman\OneDrive\Desktop\anamika project\1\preview.html', 'r', encoding='utf-8') as f:
    html = f.read()
new_html = re.sub(r'<style>.*?</style>', '<link rel="stylesheet" href="assets/css/main.css?v=3">', html, flags=re.DOTALL)
with open(r'c:\Users\naman\OneDrive\Desktop\anamika project\1\preview.html', 'w', encoding='utf-8') as f:
    f.write(new_html)
print('Styles replaced successfully')
