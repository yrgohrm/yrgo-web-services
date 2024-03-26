import type { Config, Context } from "@netlify/functions"

const facts = [
  "A black panther is really a black leopard.",
  "A cat has 32 muscles in each ear.",
  "A dog’s sense of smell is 1000 times greater than a human!",
  "A dog’s shoulder blades are unattached to the rest of the skeleton to allow greater flexibility for running.",
  "A garden caterpillar has 248 muscles in its head.",
  "A grasshopper can leap 20 times the length of its own body.",
  "A group of owls is called a parliament.",
  "A herd of sixty cows is capable of producing a ton of milk in less than a day.",
  "A housefly hums in the key of F.",
  "A lion in the wild usually makes no more than twenty kills a year.",
  "A moth has no stomach.",
  "A newborn Chinese water deer is so small it can almost be held in the palm of the hand.",
  "A newborn kangaroo is the size of a lima bean.",
  "A single elephant tooth can weigh as much as 9 pounds.",
  "A skunk will not bite and throw its scent at the same time.",
  "A tarantula spider can survive for more than two years without food.",
  "A whale’s heart beats only nine times a minute.",
  "A woodpecker can peck 20 times per second.",
  "Alligators generally live between 30 & 50 years.",
  "Almost half the pigs in the world are kept by farmers in China.",
  "An anteater is nearly 6 feet long, yet its mouth is only an inch wide.",
  "An elephant can smell water up to 3 miles away.",
  "Animals generate 30 times more waste than humans which is 1.4 billion tons every year.",
  "Ants never sleep. Also they don’t have lungs.",
  "At birth, baby kangaroos are only about an inch long – no bigger than a large water bug or a queen bee.",
  "Baby horses can walk and run after just a few hours of being born.",
  "Blue-eyed lemurs are one of two (non-human) primates to have truly blue eyes.",
  "Canis lupus lupus is the scientific name for a grey wolf.",
  "Cat whiskers are so sensitive they can detect the slightest change in air current.",
  "Cats have 26 baby teeth and 30 permanent teeth.",
  "Cats have 32 muscles in each ear.",
  "Cats have 4 rows of whiskers.",
  "Cats have no collarbone, which is one reason they are so flexible.",
  "Cats have over one hundred vocal sounds, while dogs have about ten!",
  "Cats spend approximately 30% of their waking hours grooming themselves.",
  "Chocolate, macadamia nuts, cooked onions, or anything with caffeine is harmful to dogs.",
  "Cows can sleep standing up, but they can only dream lying down.",
  "Cows have one large stomach that is divided into four compartments to go through the different stages of digestion.",
  "Crocodiles cannot stick their tongue out.",
  "Dalmatians are born without spots! They are born with plain white coats with their first spots appearing after they are 1week old.",
  "Deer can’t eat hay.",
  "Deer have no gall bladders.",
  "Dogs have 28 baby teeth and 42 permanent teeth.",
  "Dogs have sweat glands in between their paws.",
  "Dogs sweat through their foot pads to help keep them cool. They also keep cool by panting.",
  "During World War II, Americans tried to train bats to drop bombs.",
  "Elephants are covered with hair.",
  "Even a small amount of alcohol placed on a scorpion will make it go crazy and sting itself to death!",
  "Every day of the year, 100 whales are killed by whale fisherman.",
  "Every dog has a unique nose print with no two alike.",
  "Feline’s jaws cannot move sideways.",
  "Fireflies do not bite or have pincers. Fireflies are harmless, they don’t even carry diseases.",
  "Fleas can jump 350 times its body length.",
  "For every human in the world there are one million ants.",
  "George Washington’s teeth were made of elephant ivory, and walrus tusks.",
  "Goats and sheep are seasonal breeders.",
  "Goats were the first animals domesticated by man in 10,000 B.C.",
  "Gorillas can catch human colds and other illnesses.",
  "Greyhounds are the world’s fastest dogs with the ability to reach up to 45 mph.",
  "Hippos can run faster than humans!",
  "Hummingbirds are the only birds that can fly backwards.",
  "If you cut off a snail’s eye, it will grow a new one.",
  "If you keep a goldfish in a dark room, it will become pale!",
  "If you lift a kangaroo’s tail off the ground it can’t hop – they use their tails for balance.",
  "In 2003, Dr. Roger Mugford invented the “wag-o-meter” a device that claims to interpret a dog’s exact mood by measuring the wag of its tail.",
  "In Alaska it is illegal to whisper in someone’s ear while they’re moose hunting.",
  "It is much easier for dogs to learn spoken commands if they are given in conjunction with hand signals or gestures.",
  "Just one cow gives off enough harmful methane gas in a single day to fill around 400 liter bottles.",
  "Killer whales are not whales at all, rather a species of dolphin.",
  "Lonomia obliqua is the world’s deadliest caterpillar.",
  "Male rabbits are called “bucks,” females are “does.”",
  "Most elephants weigh less than the tongue of a blue whale.",
  "Nine percent of dog owners will have a birthday party for their pet.",
  "No two tigers ever have the same stripes, and this is how individual tigers can be identified.",
  "On average, cows poop 16 times per day!",
  "On average, dogs have better eyesight than humans, although not as colorful.",
  "Only female mosquitoes bite.",
  "Ostriches can run faster than horses, and the males can roar like lions.",
  "Pear and apple seeds contain arsenic, which may be deadly to dogs.",
  "Polar bear skin is black!",
  "Reindeer milk has more fat than cow milk.",
  "Scientists have performed brain surgery on cockroaches.",
  "Slugs have 4 noses.",
  "Snakes are carnivores, which means they only eat animals, often small ones such as insects, birds, frogs and other small mammals.",
  "Snoopy, from Charles M. Schultz’s “Peanuts” comic strip, is a beagle.",
  "Some male songbirds sing more than 2,000 times each day.",
  "Starfish do not have a brain.",
  "The average fox weighs 14 pounds.",
  "The Basenji, an African wolf dog, does not bark in a normal way but may yodel or scream when excited!",
  "The bat is the only mammal that can fly.",
  "The blue whale weighs as much as thirty elephants and is as long as three Greyhound buses.",
  "The dumbest dog in the world is the Afghan hounds.",
  "The earliest European images of dogs are found in cave paintings dating back 12,000 years ago in Spain.",
  "The female lion does ninety percent of the hunting.",
  "The flamingo can only eat when its head is upside down.",
  "The flea can jump up to 200 times its own height. This is equal to a man jumping the Empire State Building in New York.",
  "The great horned owl has no sense of smell.",
  "The honey bee has been around for 30 million years.",
  "The kangaroo’s ancestors lived in trees. Today there are eight different kinds of tree kangaroos.",
  "The Latin name for moose is alces alces.",
  "The leg bones of a bat are so thin that out of the 1,200 species of bats, only 2 can walk on ground. These are the Vampire bat and the Burrowing bat.",
  "The longest recorded life span of a slug was 1 year, 6 months.",
  "The most dogs ever owned by one person were 5,000 Mastiffs owned by Kubla Khan.",
  "The most poisonous fish in the world is the stone fish.",
  "The only mammal capable of flight is the bat.",
  "The only mammals to undergo menopause are elephants, humpback whales and human females.",
  "The ostrich has two toes on each foot which gives it greater speed.",
  "The phrase “raining cats and dogs” originated in seventeenth-century England. During heavy rainstorms, many homeless animals would drown and float down the streets, giving the appearance that it had actually rained cats and dogs.",
  "The scientific name of the red fox is Vulpes vulpes.",
  "The smell of a skunk can be detected by a human a mile away.",
  "The very first bomb that the Allies dropped on Berlin in World War Two hit an elephant.",
  "The world’s smallest dog was a Yorkshire Terrier, which weighed just four ounces.",
  "There is a butterfly in Africa with enough poison in its body to kill six cats!",
  "There is an average of 50,000 spiders per acre in green areas.",
  "Tigers have striped skin as well as their fur.",
  "To escape the grip of a crocodile’s jaw, push your thumb into its eyeballs-it will let you go instantly.",
  "Turtles, water snakes, crocodiles, alligators, dolphins, whales, and other water going creatures will drown if kept underwater too long.",
  "We share 70% of our DNA with a slug.",
  "We share 98.4% of our DNA with a chimp.",
]

export const config: Config = {
  path: "/animal-facts"
}

export default async (req: Request, context: Context) => {

  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET",
  }

  // set up very liberal CORS policy
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders
    })
  }

  if (req.method !== "GET") {
    return new Response(null, {
      status: 405
    })
  }

  const randomFactIndex = Math.floor(Math.random() * facts.length)
  const randomFact = { fact: facts[randomFactIndex] }

  return new Response(JSON.stringify(randomFact), {
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders,
    }
  })
}
