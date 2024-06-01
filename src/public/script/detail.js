document.addEventListener('DOMContentLoaded', () => {
    const stars = document.querySelectorAll('.star');
    const ratingValue = document.getElementById('rating-value');
    const ratingInput = document.getElementById('rating-input');

    // Function to set the rating visually
    function setRating(rating) {
        stars.forEach(s => {
            s.classList.remove('selected');
            if (s.getAttribute('data-value') <= rating) {
                s.classList.add('selected');
            }
        });
        ratingValue.textContent = `Đánh giá của bạn: ${rating}`;
        ratingInput.value = rating;
    }

    // Load rating from localStorage
    const savedRating = localStorage.getItem('rating');
    if (savedRating) {
        setRating(savedRating);
    }

    stars.forEach(star => {
        star.addEventListener('click', () => {
            const value = star.getAttribute('data-value');
            localStorage.setItem('rating', value);
            setRating(value);
        });

        star.addEventListener('mouseover', () => {
            const value = star.getAttribute('data-value');
            setRating(value);
        });

        star.addEventListener('mouseout', () => {
            const savedRating = localStorage.getItem('rating');
            setRating(savedRating || 0);
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const ratingValueElement = document.getElementById('rate-reviewers');
    const stars = document.querySelectorAll('.reviewers-star');

    function setStars(rating) {
        stars.forEach(star => {
            star.classList.remove('selected');
            if (parseFloat(star.getAttribute('data-value')) <= rating) {
                star.classList.add('selected');
            }
        });
    }

    // Get the initial rating from the text content
    const ratingText = ratingValueElement.textContent;
    const rating = parseFloat(ratingText.split(': ')[1]);

    // Set the stars based on the initial rating
    setStars(rating);
});

document.addEventListener('DOMContentLoaded', () => {
    const openPopupBtn = document.getElementById('open-popup-btn');
    const popup = document.getElementById('report-popup');
    const closeBtn = document.querySelector('.close-btn');

    openPopupBtn.addEventListener('click', () => {
        popup.style.display = 'flex';
    });

    closeBtn.addEventListener('click', () => {
        popup.style.display = 'none';
    });

    // Close the popup when clicking outside of the popup content
    window.addEventListener('click', (event) => {
        if (event.target === popup) {
            popup.style.display = 'none';
        }
    });
});