import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { getAxios } from './js/getAxios';
import { createMarkupImg } from './js/gallery.js';

const form = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const infitity = document.querySelector('.infitity-scroll');

form.addEventListener('submit', createMarkupGallery);

const pixabay = new getAxios();
const lightboxGallery = new SimpleLightbox('.gallery a');

async function createMarkupGallery(e) {
  e.preventDefault();

  observer.observe(infitity);
  clearGallery();
  pixabay.resetPage();

  pixabay.searchQuery = e.currentTarget.searchQuery.value.trim();

  if (pixabay.searchQuery === '') {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );

    return;
  }

  try {
    const { hits, totalHits } = await pixabay.getImages();
    pixabay.setTotal(totalHits);

    if (hits.length === 0) {
      return Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }

    Notify.success(`Hooray! We found ${totalHits} images.`);

    const markup = createMarkupImg(hits);
    updateMarkup(markup);
  } catch (error) {
    console.log(error);
    clearGallery();
  }
}

function updateMarkup(markup) {
  gallery.insertAdjacentHTML('beforeend', markup);
  lightboxGallery.refresh();
}

function clearGallery() {
  gallery.innerHTML = '';
}

async function onEntry(entries) {
  entries.forEach(async entry => {
    try {
      if (
        entry.isIntersecting &&
        pixabay.query !== '' &&
        gallery.childElementCount !== 0
      ) {
        pixabay.incrementPage();

        const { hits } = await pixabay.getImages();
        const markup = createMarkupImg(hits);
        updateMarkup(markup);

        if (pixabay.hasMoreImages()) {
          Notify.info(
            "We're sorry, but you've reached the end of search results."
          );

          observer.unobserve(infitity);
        }
      }
    } catch (error) {
      console.error(error);
    }
  });
}

const observer = new IntersectionObserver(onEntry, {
  rootMargin: '100px',
});
