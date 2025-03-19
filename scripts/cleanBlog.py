from bs4 import BeautifulSoup
import sys
# import json

def extract_desired_text(html_content):
    # Parse the HTML content
    soup = BeautifulSoup(html_content, "html.parser")

    # Get all the text while removing all HTML tags
    cleaned_text = soup.get_text(separator=' ', strip=True)
    print('testing print')
    return cleaned_text

# Get HTML input from command line argument
if __name__ == "__main__":
    # Read and parse the input
    html_content = sys.argv[1]
    
    # Process and print the cleaned text
    print(extract_desired_text(html_content))
