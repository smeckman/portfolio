export interface Description {
  text: string;
  url?: string;
}

export interface Skill {
  category: string;
  items: Description[];
}

export interface Experience {
  title: string;
  company: string;
  period: string;
}

export interface Content {
  name: string;
  about: {
    title: string;
    description: string;
  };
  experience: {
    title: string;
  };
  skills: {
    title: string;
    categories: Skill[];
  };
}

export const content: Content = {
  name: 'Steve Meckman',
  about: {
    title: 'About Me',
    description:
      'Business-results focused software engineer with proven leadership '
      + 'in creating innovative and efficient designs across multiple platforms. '
      + 'Quickly and effectively harnesses new technologies. '
      + 'A passionate developer with a love for creating immersive experiences.',
  },
  experience: {
    title: 'Experience',
  },
  skills: {
    title: 'Skills',
    categories: [
      {
        category: 'JVM',
        items: [
          { text: 'Java' },
          { text: 'Spring Boot' },
          { text: 'Reactive Streams' }
        ],
      },
      {
        category: 'JavaScript',
        items: [
          { text: 'React' },
          { text: 'Angular' },
          { text: 'Node.js' },
          { text: 'ECMAScript', url: 'https://gist.github.com/smeckman' },
          { text: 'TypeScript' },
          { text: 'RxJS' }
        ],
      },
      {
        category: 'Data Management',
        items: [
          {
            text: 'PostgreSQL',
            url: 'https://deep-thoughts-by-steve.hashnode.dev/magical-merchandise-analyzing-sales-data-with-postgresql-ctes'
          },
          { text: 'Kafka' },
          { text: 'NoSQL' }
        ],
      },
      {
        category: 'Continuous Delivery',
        items: [
          { text: 'AWS' },
          { text: 'Kubernetes' },
          { text: 'Docker' },
          { text: 'Git' }
        ],
      },
      {
        category: 'Cloud Infrastructure',
        items: [
          { text: 'AWS' },
          { text: 'Azure' }
        ],
      },
      {
        category: 'Other',
        items: [
          { text: 'Loves puppies' },
          { text: 'Long walks on the beach' }
        ],
      },
    ],
  },
};
