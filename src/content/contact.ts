export interface ContactMethod {
  label: string;
  value: string;
  href: string;
  icon: string;
}

export const contactMethods: ContactMethod[] = [
  {
    label: 'Email',
    value: 'garrovillasnathan@gmail.com',
    href: 'mailto:garrovillasnathan@gmail.com',
    icon: '@',
  },
  {
    label: 'LinkedIn',
    value: 'linkedin.com/in/nathan-garrovillas',
    href: 'https://www.linkedin.com/in/nathan-garrovillas/',
    icon: 'in',
  },
  {
    label: 'GitHub',
    value: 'github.com/nateboyo',
    href: 'https://github.com/nateboyo',
    icon: '{ }',
  },
  {
    label: 'Studio',
    value: 'creativeshoreli.com',
    href: 'https://creativeshoreli.com',
    icon: 'CS',
  },
];
