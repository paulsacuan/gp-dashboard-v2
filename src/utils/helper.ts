export const renderStatus = prop => {
  let emoji = `✅`;
  switch (prop.toString()) {
    case '1':
      emoji = `✅`;
      break;
    case '0':
      emoji = `❌`;
      break;
    default:
      emoji = `✅`;
      break;
  }
  return emoji;
};

export const renderProductAvailability = prop => {
  let availability = `✅`;
  switch (prop.toString()) {
    case '1':
      availability = `B2C & B2B`;
      break;
    case '0':
      availability = `B2B Only`;
      break;
    case '2':
      availability = `B2C Only`;
      break;
    default:
      availability = `B2C & B2B`;
      break;
  }
  return availability;
};

export const renderSaleType = prop => {
  let saleType = `✅`;
  switch (prop.toString()) {
    case '1':
      saleType = `Flash Sale`;
      break;
    case '0':
      saleType = `None`;
      break;
    case '2':
      saleType = `Season Sale`;
      break;
    default:
      saleType = `None`;
      break;
  }
  return saleType;
};

export const renderProductGarageType = prop => {
  let productGarageType = `✅`;
  switch (prop.toString()) {
    case '1':
      productGarageType = `All Platform`;
      break;
    case '0':
      productGarageType = `Rapide Platform Only`;
      break;
    case '2':
      productGarageType = `For GoParts Platform Only`;
      break;
    default:
      productGarageType = `All Platform`;
      break;
  }
  return productGarageType;
};
