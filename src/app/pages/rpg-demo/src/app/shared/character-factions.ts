// Optional typing (nice to have)
export interface Faction {
  name: string;
  description: string;
}

export const factions: Faction[] = [
  { name: "The Iron Brotherhood",
    description: "The Iron Brotherhood is a faction of brave and honorable warriors. They value strength, courage, and loyalty above all else. Their members are known for their iron will and unbreakable spirit."
  },
  { name: "The Arcane Order",
    description: "The Arcane Order is a faction of powerful mages. They seek knowledge and wisdom, and their magic is a tool to understand the mysteries of the universe. They are respected and feared for their magical prowess."
  },
  { name: "The Silent Knives",
    description: "The Silent Knives is a faction of skilled rogues. They value stealth, cunning, and precision. Their members are masters of the shadows, using their skills for espionage and assassination."
  },
  { name: "The Nature's Guardians",
    description: "The Nature's Guardians is a faction of druids and rangers. They are the protectors of the natural world, using their abilities to maintain the balance between civilization and nature."
  }
];