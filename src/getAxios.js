'use strict';
import axios from 'axios';

export class getAxios {
  #APIKEY = '33826929-2876bca68a673fc535a8a1f73';
  #BASEURL = 'https://pixabay.com/api/';

  constructor() {
    this.page = null;
    this.q = null;
  }

  getPhoto() {
    const options = {
      params: {
        key: this.#APIKEY,
        orientation: 'horizontal',
        q: this.q,
        image_type: 'photo',
        safesearch: true,
        page: this.page,
        per_page: '40',
      },
    };
    return axios.get(`${this.#BASEURL}`, options);
  }
}
