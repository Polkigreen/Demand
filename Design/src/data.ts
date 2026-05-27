import { TaskRequest, HelperProfile, ChatSession, DashboardSchedule } from "./types";

export const MOCK_HELPERS: HelperProfile[] = [
  {
    id: "anders",
    name: "Anders S.",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuC3t_DtZXgS4v4msRQzIzQXIzSjNZrg4Ez4jo5dy2mAleCWYOTPFTGQNs0pWW72by1XI4S95QlwcgkYrMmAt_orK99VjoEs0rbVJNZC-Zxo8wlAOTDjOkXoJqRUkcXaCzWE12q2rZZUQmrC8-ltbT8oJRJDLkpicJ-EoHq6xbhCSQmZuC-OMVfpM4KE40YjKTUvHaHowi8urxcA3Pe9m1q9ike-wDKOJ83UhIjobenQ1GnvDmpoIOmYF2VVdr4OjjDzskswAtGb5s0",
    rating: 4.9,
    reviewsCount: 52,
    distance: "Within 5km",
    bio: "I'm a handyman with 10 years of experience. I love helping my neighbors with IKEA assembly, complex garden work, and fixing those little things around the house that never seem to get done!",
    skills: ["Furniture Assembly", "Gardening", "Plumbing", "Light Electrical", "Painting", "Drywall Repair"],
    rateHour: 250,
    responseRate: "100%",
    typicalResponseTime: "< 1 hour",
    verified: true,
    examples: [
      {
        title: "IKEA Billy Bookcase Wall",
        imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuALdzbDmrekZEuukuZqonVVS-hgNvtK5MsnVSyPWz4RKrQ6oE7M7H7crQD0_bwqoR0mZ2dXParOx-3h8UdNFn7Tlvw1EQpRREFJz9M3AdTwnvXSF92BZUIjlGwf0d22NB8RdOqC9iiaD4l9QYkrSBSNq1yqCJgHcqNm7mKt4ZS2ge_V9Mx8ABFXq1HzEinOXXm8n6uNLj6vhW8GCFnNcopPdlMC8LNddEnrn_RipCF6sz5DIILY9D-PU061W1rZxXtH__nyaK7YcUg"
      },
      {
        title: "Garden Pruning Projects",
        imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAS5YARqQJ1fD6eKfwMO06V7fbSsuA3j3iDmSza7yqueXuCJ9Py9fY0R08wPH4d3vBOOl93rlXrPysVgd3oh2-DoKqvIfQ_DXyKv0hpnHtKVTExHdqpvdDim8Uu10Tgk7bEEyrmoc4hOu5wx8MIl1eCA7GCdwqrnYlzdjaxvyYqq3IIQhaewJQI9lVeg-b0VT_KcTgvY6G-VKaz8PDC8nSdZBfzxV8mFdUQMgrqx8cUzK-7Hg_ViSIDURMHKXvH1TCAthjikgv1MEY"
      },
      {
        title: "Teal Painted Accent Wall",
        imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCqj1_zsFtyBTK1tBy8HyyeSAVPtOD8sdsPlfS70iGCPAcgUbXsvPOyKokmLtc_QBkK-fkVtSvoUEYtYlYndllmgsi3B0PC9ZKRaPpVSIa0f3UrU_tfwCm10kZFYqRJCmCtL2uuUscoIVgm0CeOvORfnnYeBjpy5S3IvIVAxywNJkhdjW1BYrErrvZMUol9mQndbQMnosR3jPIFdt9wzburUtz-G6Zt5kPlciDcOW7K6usUqF8rXfR0DrsL9_2q9TwzKdb4J_g9Ohc"
      },
      {
        title: "Workbench Hand Tool Set",
        imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuB9BTtXz0l9Wek304CHpBPbKK9vOhewEsu8P0BZjIQJHKt9gvVE2EwdRAJ38ADZHafxBjWRapmOKQGwjCcXZfcUvWECRwDYNDvO9VqoePUj3sEsJNRP2PujYntHP5-H2kEof9upYXGv7pzFnwvAFVlajVCXLoFKEsKqf0f7URzZjQ87PK8hrLStRrNn8PN3TQfU2qMCjZqCzyiecAVHODx6vE8wC9rq-_dC8EY4LoxCru7CczIh_O6BkHQ6cdu50PJpLtyNqIad1tE"
      }
    ]
  },
  {
    id: "sven",
    name: "Sven A.",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuC7C8mlHNXCUjpB8Z-3SLf9VikvTZh8nJzDTK3VotrPXPFP7QH1XKiUouPL8vlkDU8dCLEuav262C3lpsny7xRr5jOdte3PhAAsKZtJuu_mox6lR8mM-fHFtt8vug__9dLrFCuMmyDUxiAfo7oqvihfinJDhHrN2zgnhLagseXTwHqhjmaiu-Cben7VZOWWurvhcdVt5Vl7sSS28v51bDgpidAMEoidLzGAo0xjB4STgx2XhnCIxzHngKZ3-_mMu8RVgMPmp2U3KBQ",
    rating: 4.8,
    reviewsCount: 120,
    distance: "1.2 km away",
    bio: "Expert in tire changes and minor engine repairs. I bring my own professional tools and parts if needed. Swedish and English greeting.",
    skills: ["Car Help", "Tire Change", "Engine Tuning", "Emergency Fixes"],
    rateHour: 300,
    responseRate: "98%",
    typicalResponseTime: "< 30 mins",
    verified: true,
    examples: []
  },
  {
    id: "maria",
    name: "Maria L.",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuA0PpeqzR8Y6N2JrBhoZGtTccZ7JgYqYTalB8osZV7RJQffZTka4vxfAyqv8CFDExE02FpWDG_fYZHGrueCNxkY5eAx5GS2gWKQyIRrbZ5Su_NIbsOOe2zbYnIizLLMrJsyMZ4DNBeErcWd7PKqXEb3ZVg0Eg2uYPG71zHXnw3V9sznG1T8i_AbtIY_y52SkbhHPKF7drRy6Wfubn7TwBlLQTtqh2-ibiJZpfYUnXZk0i74X-R1LYhffSBf0H34vLkJiUhoyPYrXLs",
    rating: 4.9,
    reviewsCount: 84,
    distance: "2.5 km away",
    bio: "Specializing in electronic diagnostics, battery replacements, and oil changes. Fully mobile setup with tablet diagnostic logging.",
    skills: ["Car Help", "Electrical Diagnostics", "Battery Service", "Oil Flush"],
    rateHour: 350,
    responseRate: "100%",
    typicalResponseTime: "< 1 hour",
    verified: true,
    examples: []
  },
  {
    id: "erik",
    name: "Erik J.",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAijX0Uq3kUby8jxWXJJO8VQub8lVWAQMNR6wj_zT8Axm1opk19bivGRd64Q6kKg4iNqlvyNmPTu6Aza3rQacZRTXRweppHuJR5QdbEVqEXwSACHezzRiqcH5j6xk3qMUDRsyBpPNnaWI0Ic92nPlkhCCUYmF4KewYejoyOEA-BBNU_6vd2VbZzlZ7qKNm5TpYJrM0Uyz5HF2iPIIy3xPeN1-urS1nAwB2tyaIYwPeg_8Eqy5sWpcyTFuwXCsu7Li5e7j_gbLLLuAY",
    rating: 4.7,
    reviewsCount: 42,
    distance: "0.8 km away",
    bio: "Interior and exterior detailing pro. I'll make your car look brand new in your own driveway. Affordable rates and premium polishes.",
    skills: ["Car Help", "Car Detailing", "Polish/Wash", "Interior Cleanup"],
    rateHour: 200,
    responseRate: "95%",
    typicalResponseTime: "< 2 hours",
    verified: false,
    examples: []
  },
  {
    id: "lars",
    name: "Lars H.",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCQnQKiJJV5B6ceUFMH4ksXEDBg0X9aPtBm7gFtJ4To9PjrbEfP3_Ch3ibojA9ukf-fesT8CaoB3wuubHrknIayVbOSDuStgGYuaG-cg28eY7AlQDltKQarU94CDomNF0CGe7XIRfpQf0BDEI6AK1d6sXp8uK6nLClW8SdXWz80M83aioitTdBSOopqxLPU7Rv5N9VwBiPtk3nplatT3svVCVIBauZpqjNAbA6BzmsB0niLv-3xEUZzK4VoBILo4YOkWv0zpV_chks",
    rating: 5.0,
    reviewsCount: 18,
    distance: "4.1 km away",
    bio: "Brake pad replacement and brake fluid flushing. Quick, reliable service at your location or mine with premium torque wrench calibration.",
    skills: ["Car Help", "Brake Pad Install", "Fluid Flush", "Tire Alignment"],
    rateHour: 280,
    responseRate: "100%",
    typicalResponseTime: "< 1 hour",
    verified: true,
    examples: []
  },
  {
    id: "sarah_m",
    name: "Sarah Miller",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDR5jYCvbOWcobPPq8-N7PxBwAspUBxpQgxdDnKVhKF4L2HBAdU4M20MEA4bki_4JpOFwUA_y6q93nBDYDCTQj3EdP6Sljw-fYJ2xyrcukrF0R-Gz8TwOAyT7kSb9bhOp4V1EBt5nXwY2hAYORJ9zh0dQS6AvxqwFXvcWGYo951i2tiF6ctItk3TJKbx057JQ-GoTEYJqxZwqoEOUulVtHkJ9keXMfeX9CtzyZpPVBfvyiMBo7GURhmwZH68CUfAFKCRzYZUx9EqmA",
    rating: 4.9,
    reviewsCount: 46,
    distance: "1.5 km away",
    bio: "Professional carpenter with specialized focus on IKEA and custom modular shelving assemblies. Safety-certified and rapid replies.",
    skills: ["Furniture Assembly", "IKEA expert", "Cabinet Hangs"],
    rateHour: 360,
    responseRate: "100%",
    typicalResponseTime: "< 15 mins",
    verified: true,
    examples: []
  }
];

export const INITIAL_REQUESTS: TaskRequest[] = [
  {
    id: "req_santa",
    title: "Santa needed for Dec 24th",
    category: "Event Prep",
    description: "Looking for a friendly, professional Santa Claus to visit our family on Christmas Eve. Needs to hand out gifts to 3 excited children. High-quality costume preferred!",
    budget: 800,
    location: "Stockholm",
    date: "2026-12-24",
    time: "18:00",
    status: "Open",
    appliedCount: 4,
    urgent: true,
    creator: {
      name: "Erik V.",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBOveJumbSicUHZsd6dKm0opscWaW7StWqBYPbFsGexcTJ99KaaFGxeFwqodYs-u8RMgnVlxOxIbFnln__BxmVxOHnGTuPEmfuwp5TEDOU8tRxEw8ORALe6CrAwTYhZdSiwkx2NvPTmGBBAvKRCaP-TgX67UqIFRAe2HZpzR62SCyatfOnkG-k3rvb7rWid9suoR_CoOP1HWEj8c5KtVfQMU8dLtHxUzthmODP_ECFR28x5OTk9iUbiwU0qeo2hoMdaFU50EvPs8XQ",
      distance: "0.8mi"
    },
    createdAt: "2026-05-26T08:00:00Z",
    photoUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDOBkRRs7FqKCrtrrJEQwoKZ6hxpt7Jcthbo_RnASZBaSvv17280Mexo_dcDWRiknr7gqlMLduJa3sDL38ISDKb1wKSY1Ii8ZsQLLFw4oVEm5jXKR7OaRtpmwRdnuO9k8KKLZn6pi2qh2uRlDBiUFPoLXUM7rCPfvY9eq5UZb8aqeEEZMjwqBBrUJNLibElR-O6EPDox8mmLfUn1wGZpQVp4ZzpAVRoV1J_mGVi104_GX7ktBUI2I_y2RmOhhphPBl0TEfc5VHEmok"
  },
  {
    id: "req_dogwalk",
    title: "Morning dog walk",
    category: "Pet Care",
    description: "Looking for a trustworthy neighbor to take our active Golden Retriever for a brisk 30-minute walk on weekday mornings.",
    budget: 150,
    location: "Gothenburg",
    date: "2026-05-27",
    time: "08:30",
    status: "Assigned",
    appliedCount: 1,
    urgent: false,
    creator: {
      name: "Sarah L.",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDqWK7Xnw05suFw9QoL27n8FrrSFbRynYnUmLLwQW1LQDudbNv8iYTN0VzRjh7hUJmUAzJA8fyDQAAGOG-k2TV_VI2p43Elnmc2gEn0291yEKFImAf7K3OEk4ZlCErgWkYMQxv6s8RLGgew15mNiguSYpAfEAT2cTKeV4GdXZSCBzRQzq987MphPbZyTj0XN_O7niPnPtThZQ7isw31dSFPHN4DHpjjbP_1bIUkgu9Z0IDZDAyxvu6nYdRofNjv7_5rAv6KZIpCWVA",
      distance: "1.2mi"
    },
    createdAt: "2026-05-26T07:45:00Z",
    photoUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCeQCgcrRIBK2kVwAWTKs5Zk-nuGEuaKmsTgLzQyBi-M0h3aPW1XhGrq5vr-Q9TwXzTHK0s0a60RDfgDfe3r03AqAdmxW9G2TL-nCG9Nnu23vnb3PG5S_iGXJEz3he54pYw1GrVxI7XkdpyFPu8WzSBJPQxflXRBFPz6j6Nbz0xS-QctZJeAw61zmxnmG0g5pixUZaUl93bw_8xMINyw1CcRUOUmKVoCKfH-pRNO_mUQig0ioqb5Bv_emrwP6bu2OppM2w4IVkcR4w"
  },
  {
    id: "req_wardrobe",
    title: "IKEA Wardrobe Help",
    category: "Assembly",
    description: "Just bought a large modular IKEA PAX wardrobe system (2 frames, sliding doors) and need a handyman who knows how to mount it and anchor it to our wall properly.",
    budget: 450,
    location: "Stockholm",
    date: "2026-05-28",
    time: "10:00",
    status: "Open",
    appliedCount: 0,
    urgent: false,
    creator: {
      name: "David K.",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuA1lvyoMziLldyfX2iPwGM6LM7I5ghxI8Ug6YHUU-bh5QS7ELM3fN28o40Qa6agBplISjLyJe8DBhEpGF8K_D1_xoU7YqZO_pGgw8z4PR2Yb8PCotzYn0rL7wAbVZwfSkOqnGOpp6rZaJrG2Xv6QMKU2POxqkDOnAhf320-84UfCS6VTstmiCsPtVAJ4PcyokBuca9QePEKSbXVn4SQDYp5KpTcNiIr6B-grdqCjnIKHvOEfgURxAOo4H0_V9c7TlNnXbS66jq4_xM",
      distance: "2.0mi"
    },
    createdAt: "2026-05-26T07:15:00Z",
    photoUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCZqtuoNAsJfjkWGhgnLwGMMCfl84cZ6gGCBsczJ5PQdG7r5tKMRVado6JVs-qKriI_xVShXk5gwF4smEq-fucrRAOM5zkjQijFgpglah9UXXngx-Doe6gcJBbk8etrThNvD9gb4fhww4cqPLAmTmgC7l4rpJSm6Nqo1BwKeKa75OMMLtputEMxusMLGnAp0uU0GRNZbUrKCxHhiTYzWqwW0BbDOgNdvR3KrJPYKJL3MaTHA72W_QWeG1KkD9Yt00x7q-JlJQc5CJI"
  },
  {
    id: "req_garden",
    title: "Garden leaves removal",
    category: "Assembly",
    description: "Lawn and backyard need clearing of autumn leaves, we also need some light branch pruning of the apple tree. Apple tree clippings can be piled next to compost.",
    budget: 300,
    location: "Malmö",
    date: "2026-05-30",
    time: "14:00",
    status: "Open",
    appliedCount: 12,
    urgent: false,
    creator: {
      name: "Felix M.",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBOveJumbSicUHZsd6dKm0opscWaW7StWqBYPbFsGexcTJ99KaaFGxeFwqodYs-u8RMgnVlxOxIbFnln__BxmVxOHnGTuPEmfuwp5TEDOU8tRxEw8ORALe6CrAwTYhZdSiwkx2NvPTmGBBAvKRCaP-TgX67UqIFRAe2HZpzR62SCyatfOnkG-k3rvb7rWid9suoR_CoOP1HWEj8c5KtVfQMU8dLtHxUzthmODP_ECFR28x5OTk9iUbiwU0qeo2hoMdaFU50EvPs8XQ",
      distance: "0.5mi"
    },
    createdAt: "2026-05-26T06:30:00Z",
    photoUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBSfETpNrXy8Fxg8tiQzYP5sdaSmFeOXPMjUsKlSDEfA_VZeZHnBss8LUNccbWhxAJi5w_fCq14Fx7An5IlW23MXlMgIS5bhglCNZN-0iQfQfLLAFgQAjDqXXbqL5ppjmUPejrdtkSOv1a_emMA2WAhqRSW01Fhh5g2UvjIhOGbI8ufUzlT_lHI53ekaoTlgaiExO0ufoRU9oz4KjBCS3RG0n-NsaGK6esNkFMmus3rdkwvCJL7NVLul5GSWfWXzyLxCS--y6wmcSM"
  }
];

export const RECENTLY_POSTED_FEED: TaskRequest[] = [
  ...INITIAL_REQUESTS,
  {
    id: "feed_tire",
    title: "Need help changing tires",
    category: "Car Help",
    description: "Just got home and realized my front tire is flat. Looking for someone with a jack to swap on the spare.",
    budget: 45,
    location: "Stockholm Södermalm",
    date: "2026-05-26",
    time: "09:00",
    status: "Open",
    appliedCount: 1,
    urgent: true,
    creator: {
      name: "Felix M.",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBOveJumbSicUHZsd6dKm0opscWaW7StWqBYPbFsGexcTJ99KaaFGxeFwqodYs-u8RMgnVlxOxIbFnln__BxmVxOHnGTuPEmfuwp5TEDOU8tRxEw8ORALe6CrAwTYhZdSiwkx2NvPTmGBBAvKRCaP-TgX67UqIFRAe2HZpzR62SCyatfOnkG-k3rvb7rWid9suoR_CoOP1HWEj8c5KtVfQMU8dLtHxUzthmODP_ECFR28x5OTk9iUbiwU0qeo2hoMdaFU50EvPs8XQ",
      distance: "0.5mi"
    },
    createdAt: "2026-05-26T08:54:00Z"
  },
  {
    id: "feed_dog",
    title: "Dog walker for Golden Retriever",
    category: "Pet Care",
    description: "Need a 30-min brisk walk for my very friendly Golden Retriever this afternoon.",
    budget: 25,
    location: "Gothenburg Centro",
    date: "2026-05-26",
    time: "15:00",
    status: "Open",
    appliedCount: 0,
    urgent: false,
    creator: {
      name: "Sarah L.",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDqWK7Xnw05suFw9QoL27n8FrrSFbRynYnUmLLwQW1LQDudbNv8iYTN0VzRjh7hUJmUAzJA8fyDQAAGOG-k2TV_VI2p43Elnmc2gEn0291yEKFImAf7K3OEk4ZlCErgWkYMQxv6s8RLGgew15mNiguSYpAfEAT2cTKeV4GdXZSCBzRQzq987MphPbZyTj0XN_O7niPnPtThZQ7isw31dSFPHN4DHpjjbP_1bIUkgu9Z0IDZDAyxvu6nYdRofNjv7_5rAv6KZIpCWVA",
      distance: "1.2mi"
    },
    createdAt: "2026-05-26T08:41:00Z"
  },
  {
    id: "feed_smarthome",
    title: "Smart Home Setup",
    category: "Tech Support" as any,
    description: "Need help syncing my new Hue lights and Nest thermostat to the wifi bridge. Scandinavian layout.",
    budget: 60,
    location: "Malmö City",
    date: "2026-05-27",
    time: "11:00",
    status: "Open",
    appliedCount: 2,
    urgent: false,
    creator: {
      name: "David K.",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuA1lvyoMziLldyfX2iPwGM6LM7I5ghxI8Ug6YHUU-bh5QS7ELM3fN28o40Qa6agBplISjLyJe8DBhEpGF8K_D1_xoU7YqZO_pGgw8z4PR2Yb8PCotzYn0rL7wAbVZwfSkOqnGOpp6rZaJrG2Xv6QMKU2POxqkDOnAhf320-84UfCS6VTstmiCsPtVAJ4PcyokBuca9QePEKSbXVn4SQDYp5KpTcNiIr6B-grdqCjnIKHvOEfgURxAOo4H0_V9c7TlNnXbS66jq4_xM",
      distance: "2.0mi"
    },
    createdAt: "2026-05-26T08:11:00Z"
  }
];

export const INITIAL_CHATS: ChatSession[] = [
  {
    id: "chat_sarah",
    helperName: "Sarah Miller",
    helperAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDR5jYCvbOWcobPPq8-N7PxBwAspUBxpQgxdDnKVhKF4L2HBAdU4M20MEA4bki_4JpOFwUA_y6q93nBDYDCTQj3EdP6Sljw-fYJ2xyrcukrF0R-Gz8TwOAyT7kSb9bhOp4V1EBt5nXwY2hAYORJ9zh0dQS6AvxqwFXvcWGYo951i2tiF6ctItk3TJKbx057JQ-GoTEYJqxZwqoEOUulVtHkJ9keXMfeX9CtzyZpPVBfvyiMBo7GURhmwZH68CUfAFKCRzYZUx9EqmA",
    taskTitle: "Furniture Assembly",
    taskBudget: 45,
    lastMessage: "I've just accepted the offer! See you tomorrow.",
    lastMessageTime: "09:48 AM",
    unread: false,
    messages: [
      {
        id: "msg_1",
        senderId: "recipient",
        text: "Hi there! I saw your request for the IKEA dresser assembly. I've done dozens of those!",
        timestamp: "09:41 AM"
      },
      {
        id: "msg_2",
        senderId: "recipient",
        text: "I'm free tomorrow morning around 10 AM if that works for you? I bring all my own tools.",
        timestamp: "09:42 AM"
      },
      {
        id: "msg_3",
        senderId: "sender",
        text: "That sounds perfect! Tomorrow at 10 AM works. Do you think it will take about an hour?",
        timestamp: "09:45 AM"
      },
      {
        id: "msg_4",
        senderId: "recipient",
        text: "Yes, easily! Here is my formal offer through the NeighborHelp protection guarantee.",
        timestamp: "09:46 AM",
        offer: {
          id: "offer_pax",
          itemTitle: "Sarah Miller's Offer",
          price: 45.00,
          date: "Tomorrow, Oct 14 • 10:00 AM",
          status: "pending"
        }
      },
      {
        id: "msg_5",
        senderId: "sender",
        text: "I've just accepted the offer! See you tomorrow.",
        timestamp: "09:48 AM"
      }
    ]
  },
  {
    id: "chat_anders",
    helperName: "Anders S.",
    helperAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuC3t_DtZXgS4v4msRQzIzQXIzSjNZrg4Ez4jo5dy2mAleCWYOTPFTGQNs0pWW72by1XI4S95QlwcgkYrMmAt_orK99VjoEs0rbVJNZC-Zxo8wlAOTDjOkXoJqRUkcXaCzWE12q2rZZUQmrC8-ltbT8oJRJDLkpicJ-EoHq6xbhCSQmZuC-OMVfpM4KE40YjKTUvHaHowi8urxcA3Pe9m1q9ike-wDKOJ83UhIjobenQ1GnvDmpoIOmYF2VVdr4OjjDzskswAtGb5s0",
    taskTitle: "Garden leaves removal",
    taskBudget: 300,
    lastMessage: "Sounds great, feel free to hire me through my profile page!",
    lastMessageTime: "Yesterday",
    messages: [
      {
        id: "msg_a1",
        senderId: "sender",
        text: "Hi Anders, do you have experience with orchard tree branches?",
        timestamp: "Yesterday 04:12 PM"
      },
      {
        id: "msg_a2",
        senderId: "recipient",
        text: "Yes! Pruned over 30 properties in Södermalm. Fully insured too.",
        timestamp: "Yesterday 04:18 PM"
      },
      {
        id: "msg_a3",
        senderId: "recipient",
        text: "Sounds great, feel free to hire me through my profile page!",
        timestamp: "Yesterday 04:20 PM"
      }
    ]
  }
];

export const INITIAL_SCHEDULE: DashboardSchedule[] = [
  {
    day: "Monday",
    slots: { morning: true, afternoon: false, evening: false }
  },
  {
    day: "Tuesday",
    slots: { morning: true, afternoon: true, evening: false }
  },
  {
    day: "Wednesday",
    slots: { morning: false, afternoon: false, evening: true }
  },
  {
    day: "Thursday",
    slots: { morning: false, afternoon: true, evening: true }
  },
  {
    day: "Friday",
    slots: { morning: true, afternoon: true, evening: false }
  },
  {
    day: "Saturday",
    slots: { morning: false, afternoon: false, evening: false }
  },
  {
    day: "Sunday",
    slots: { morning: false, afternoon: false, evening: false }
  }
];

export const PAST_REQUEST_HISTORY = [
  {
    id: "past_1",
    title: "IKEA Pax Wardrobe Assembly",
    budget: 450,
    date: "Oct 12, 2023",
    status: "Completed",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuB6WjHVQ9alQkGSKyChmb7CsbG2wI65-JdHjTqg6vnpXWMvWm59LVWqzQ8RehoDjhEDQfoV-oY-59Nb39_-TbrLlCbiNHUnZaFyZXyXotf51LIaajeYLE8cCQHWbf_Dfr3QVsyQHOg4a9gYS69fMtwN2N5GlYxT4pkSrrnzXlRd0uNbNrVRd5or1HGG9nfRAcs0n_Sn7NFBRQeUXeigDf28V1iK6TEya4FVnPzxtE7zQgCMQau7k9GQQhYI__aa1iBssDsd_ZWE8Oc"
  },
  {
    id: "past_2",
    title: "Morning Dog Walk in Södermalm",
    budget: 180,
    date: "Oct 08, 2023",
    status: "Cancelled",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCuM1HH-SsaO15S1AvwpZFgvRjYXh1V1beaQrcC51DgE7xS88uvL3QRxhRZ21aTpTKZ6wi_xlpqGptAvM_90lbx8OQUcWK2Aa_Ljtf7gQGvxaWvUSK09yueY1kjfiNJbUsP97lAgecr_Q2VjvhKaHhxRArP2eCabNrf1zsly0hPDxIn-8WUGQq95WPc-NggaQJgxrlJZaMcDXMeiR2xQWTxqY9JPdHjzUfrmeNUNXcDdvXQArqCWmIVs8fvRUGcM_099leBcDf3wiA"
  },
  {
    id: "past_3",
    title: "Lawn Mowing & Trimming",
    budget: 320,
    date: "Sept 28, 2023",
    status: "Completed",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBmpLvUS_sno7KXIKjU39gMqNhvWUPGi-bSvrrz2PV89lABsIsAb01Neg71M7g5X21RjaMI2u2X1XwKZu6xZvKI231UdAqtwL-AUtUoG4W-nrAqodynGYoy-4PHXubRmUhbKOjgfezPmWsLiH59ycVET-8IpAZy6NvCWD0k73NIVPBEKaJBuWROsLFgp7Vq6aJIQh4vRZwEMNQ2b9ekqUajIUJkc-H-moPB9S30H2nums0W10TgNTp9F4vtdjA6Ojb4SQmYmp5XFn8"
  },
  {
    id: "past_4",
    title: "WiFi Network Optimization",
    budget: 600,
    date: "Sept 22, 2023",
    status: "Completed",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDTjLFCaLb-YjWc01ql1YsC9l41D52faKyHW1WWLOicyerx2s3o9MR5FWjhGRomtGzBSYRppQuyaURsHP7Dehj3kgjMvDJ4OY46QMHsUmD01ZOPjDJ-9-IqcLg7wj77PT7OkC5U1Nzo7WcpgkYvzOvib15LPcznZ40dB-KkmqWckMU06ZHvEKa0W3vzSAuS0AN7qvU6FigrnpLMR0-DMjqPyJxSkAAqZ7qG9tpzIX5HPDbkWMP2Cm7n-gACVAijeNNftHfiB3LKGe8"
  }
];
