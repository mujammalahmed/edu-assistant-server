from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Define your target blog description and array of blog descriptions
target_blog = {
    "id": 1,
    "slug": "target-blog",
    "description": "This is the description of the target blog"
}

other_blogs = [
    {"id": 2, "slug": "blog-1", "description": "This is the description of blog 1"},
    {"id": 3, "slug": "blog-2", "description": "Description for blog 2 goes here"},
    {"id": 4, "slug": "blog-3", "description": "Yet another blog description"},
] 

# Extract descriptions for similarity calculation
target_description = target_blog["description"]
other_descriptions = [blog["description"] for blog in other_blogs]

# Combine the target description with the array of other descriptions
all_descriptions = [target_description] + other_descriptions

# Convert descriptions to TF-IDF vectors
vectorizer = TfidfVectorizer()
tfidf_matrix = vectorizer.fit_transform(all_descriptions)

# Calculate cosine similarity (target to each blog)
similarities = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:]).flatten()

# Display similarity results
for i, blog in enumerate(other_blogs):
    print(f"Similarity between target blog and {blog['slug']} (ID: {blog['id']}): {similarities[i]:.4f}")
