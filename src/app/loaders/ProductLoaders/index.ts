import axios from 'axios';
import { Auth } from 'utils/auth';
import { apiUrl } from 'utils/constants';

// products page index
export async function productsLoader({ request }) {
  const url = new URL(request.url);
  const search = url.searchParams.get('search');
  const products = await axios.get(`${apiUrl}/v2/products/allv2${url.search}`);
  return { products, search };
}

// products page index
export async function singleProductLoader({ params }) {
  const slug = params.slug;
  const product = await axios.get(`${apiUrl}/v2/product/slug/${slug}`);
  const tiers = product && product.data.data.tier_prices;
  const total = 20;
  const tiersArray = [];
  for (let x = 0; x < total; x++) {
    const tierArr = [];
    tiers.forEach(tier => {
      if (tier.tier === x + 1) {
        const tierObj = {
          tier: 0,
          max: 0,
          min: 0,
          price: 0,
          status: 0,
          product_id: 0,
          id: 0,
        };
        tierObj.tier = tier.tier;
        tierObj.max = tier.max;
        tierObj.min = tier.min;
        tierObj.price = tier.price;
        tierObj.status = tier.status;
        tierObj.product_id = tier.product_id;
        tierObj.id = tier.id;
        tierArr.push(tierObj);
      }
    });
    tiersArray.push(tierArr);
  }
  return { product, tier_prices: tiersArray };
}

// single product : get by slug
// with categories, brands, vendors for single creation
export async function productLoader({ params }) {
  const slug = params.slug;
  let product: any = {};

  if (slug) {
    product = await singleProductLoader({ params });
  }
  const vendors = await axios.get(`${apiUrl}/v2/vendors/all?list=true`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${Auth.token()}`,
    },
  });
  const categories = await axios.get(`${apiUrl}/v2/products/categories`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${Auth.token()}`,
    },
  });
  const brands = await axios.get(`${apiUrl}/v2/products/brands`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${Auth.token()}`,
    },
  });
  const mapC = categories.data.data;
  const newCategories = [];
  for (let x = 0; x < mapC.length; x += 1) {
    for (let y = 0; y < mapC[x].children.length; y += 1) {
      newCategories.push(mapC[x].children[y]);
    }
  }
  const parentsLink = params.slug
    ? `${apiUrl}/v2/products/parents?category_id=${product.product.data.data.category.name}&list=true`
    : `${apiUrl}/v2/products/parents?list=true`;

  const parents = await axios.get(parentsLink, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${Auth.token()}`,
    },
  });

  return {
    product: slug ? product.product.data.data : {},
    vendors: vendors.data,
    categories: newCategories,
    brands: brands.data.data,
    parents: parents.data.data,
    slug,
  };
}
