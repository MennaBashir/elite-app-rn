import { assets } from 'assets/assets';

export interface Product {
  title: string;
  category: string;
  price: string;
  imageUrl: string;
}

export const featuredProducts: Product[] = [
  {
    title: 'AeroKnit Runner',
    category: 'Athletics',
    price: '$145',
    imageUrl: assets.item1,
  },
  {
    title: 'Chrono Slim',
    category: 'Wearables',
    price: '$220',
    imageUrl: assets.item2,
  },
  {
    title: 'CloudForm Lamp',
    category: 'Living',
    price: '$96',
    imageUrl: assets.item3,
  },
  {
    title: 'Luxe Leather Tote',
    category: 'Accessories',
    price: '$180',
    imageUrl: assets.item4,
  },
];
