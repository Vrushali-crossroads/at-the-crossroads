export type Episode = {
  number: string;
  title: string;
  guest: string;
  duration: string;
  image: string;
};

export const EPISODES: Episode[] = [
  {
    number: "EPISODE 09",
    title: "Leadership Starts From Within — Fix This Before You Lead",
    guest: "with Ravi Pratap",
    duration: "59:50",
    image: "/images/episodes/episode-09.jpg",
  },
  {
    number: "EPISODE 08",
    title: "The Cost of Animal Rescue — 350 Animals, Zero Help",
    guest: "with Vikash Bafna",
    duration: "1:17:04",
    image: "/images/episodes/episode-08.jpg",
  },
  {
    number: "EPISODE 06",
    title: "Inside the Life of a Veterinarian",
    guest: "with Dr. Sahil More",
    duration: "52:42",
    image: "/images/episodes/episode-06.jpg",
  },
  {
    number: "EPISODE 04",
    title: "Surviving the Film Industry",
    guest: "with a Bollywood Insider",
    duration: "1:02:18",
    image: "/images/episodes/strip-1.jpg",
  },
  {
    number: "EPISODE 03",
    title: "You Are Being Hacked",
    guest: "with an Ethical Hacker",
    duration: "55:05",
    image: "/images/episodes/strip-2.jpg",
  },
  {
    number: "EPISODE 02",
    title: "Inside the Life of a Ranji Player",
    guest: "with a Ranji Player",
    duration: "48:30",
    image: "/images/episodes/strip-3.jpg",
  },
  {
    number: "EPISODE 01",
    title: "DJ Truth",
    guest: "with DJ Truth",
    duration: "41:12",
    image: "/images/episodes/strip-4.jpg",
  },
];
