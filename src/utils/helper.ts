export const renderStatus = prop => {
  const status = prop === null ? '' : prop.toString();
  if (status === '') return `❌`;

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

export const renderGarageType = prop => {
  let garageType = `inactive`;

  switch (prop.toString()) {
    case 'rapide_service_center':
      garageType = `Rapide Service Center`;
      break;
    case 'nonlica_service_center':
      garageType = `Non-Lica Service Center`;
      break;
    case 'dealership_and_lica':
      garageType = `Dealership and Lica`;
      break;
    case 'nonlica_delearship':
      garageType = `Non-Lica Dealership`;
      break;
    case 'lica':
      garageType = `Lica`;
      break;
    case 'lica_dealership':
      garageType = `Lica Dealership`;
      break;
    default:
      garageType = `Inactive`;
      break;
  }
  return garageType;
};

export const renderCurrency = prop => {
  let PhP = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'PHP',
  });

  return PhP.format(prop);
};

export const dateFormatter = date => {
  if (!date) return;
  const d = new Date(date);
  return d.toDateString().replace(/^\S+\s/, '');
};

export const renderDate = date => {
  const d = new Date(date);
  return d.toDateString();
};
