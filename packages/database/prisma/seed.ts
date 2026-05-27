import { PrismaClient } from "@prisma/client";
import { randomBytes, scryptSync } from "crypto";

const prisma = new PrismaClient();

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hashed = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hashed}`;
}

async function main() {
  console.log("Seeding database...");

  const pw = hashPassword("testtest");

  const alice = await prisma.user.upsert({
    where: { email: "alice@test.se" },
    update: {},
    create: {
      email: "alice@test.se",
      name: "Alice Lindgren",
      passwordHash: pw,
      roles: ["REQUESTER"],
      bankidVerified: true,
      personnummer: hashPassword("19900101-1234"),
    },
  });

  const bob = await prisma.user.upsert({
    where: { email: "bob@test.se" },
    update: {},
    create: {
      email: "bob@test.se",
      name: "Bob Ekstrom",
      passwordHash: pw,
      roles: ["HELPER"],
      bankidVerified: true,
      hasFskatt: true,
      personnummer: hashPassword("19850515-5678"),
    },
  });

  const carol = await prisma.user.upsert({
    where: { email: "carol@test.se" },
    update: {},
    create: {
      email: "carol@test.se",
      name: "Carol Bjork",
      passwordHash: pw,
      roles: ["HELPER", "REQUESTER"],
      bankidVerified: true,
      hasFskatt: true,
      personnummer: hashPassword("19921212-9012"),
    },
  });

  const david = await prisma.user.upsert({
    where: { email: "david@test.se" },
    update: {},
    create: {
      email: "david@test.se",
      name: "David Norberg",
      passwordHash: pw,
      roles: ["HELPER"],
      bankidVerified: false,
      hasFskatt: false,
    },
  });

  await prisma.request.upsert({
    where: { id: "req-1" },
    update: {},
    create: {
      id: "req-1",
      title: "Montera IKEA Malm byra",
      description: "Behover hjalp med att montera en IKEA MALM byra med 6 lador. Jag har alla verktyg och instruktioner. Bor pa Sodermalm, Stockholm.",
      category: "Assembly",
      location: "Sodermalm, Stockholm",
      latitude: 59.3143,
      longitude: 18.0745,
      price: 400,
      status: "OPEN",
      requesterId: alice.id,
    },
  });

  await prisma.request.upsert({
    where: { id: "req-2" },
    update: {},
    create: {
      id: "req-2",
      title: "Hjalp med dackbyte infoor vintern",
      description: "Behover byta till vinterdack pa min Volvo V70. Dacken finns i forradet, behover nagon med verktyg och lyft.",
      category: "Car Help",
      location: "Ostermalm, Stockholm",
      latitude: 59.3379,
      longitude: 18.0855,
      price: 500,
      status: "OPEN",
      requesterId: carol.id,
    },
  });

  await prisma.request.upsert({
    where: { id: "req-3" },
    update: {},
    create: {
      id: "req-3",
      title: "Hundvakt i helgen",
      description: "Behover nagon som kan passa min golden retriever under lordag eftermiddag. Han ar snall och lugn, behover bara sallskap och en promenad.",
      category: "Pet Care",
      location: "Vasastan, Stockholm",
      latitude: 59.3464,
      longitude: 18.0398,
      price: 300,
      status: "OPEN",
      requesterId: alice.id,
    },
  });

  await prisma.request.upsert({
    where: { id: "req-4" },
    update: {},
    create: {
      id: "req-4",
      title: "Festforberedelser 30-arskalas",
      description: "Hjalp med att forbereda mitt 30-arskalas: hanga upp dekorationer, duka, blasa ballonger och stalla i ordning.",
      category: "Event Prep",
      location: "Kungsholmen, Stockholm",
      latitude: 59.3324,
      longitude: 18.0390,
      price: 350,
      status: "OPEN",
      requesterId: carol.id,
    },
  });

  await prisma.application.create({
    data: {
      requestId: "req-1",
      helperId: bob.id,
      status: "PENDING",
      priceProposal: 400,
      coverLetter: "Hej! Jag har monterat massor av IKEA-mobler tidigare och kan gora det pa ca 1 timme. Finns ledig redan imorgon.",
    },
  });

  await prisma.application.create({
    data: {
      requestId: "req-2",
      helperId: bob.id,
      status: "PENDING",
      priceProposal: 450,
      coverLetter: "Jag ar van mekaniker och har alla verktyg. Klarar bytet pa 30 minuter.",
    },
  });

  await prisma.application.create({
    data: {
      requestId: "req-2",
      helperId: david.id,
      status: "PENDING",
      priceProposal: 500,
      coverLetter: "Kan hjalpa till med dackbytet. Har egen domkraft och momentnyckel.",
    },
  });

  await prisma.application.create({
    data: {
      requestId: "req-3",
      helperId: carol.id,
      status: "PENDING",
      priceProposal: 300,
      coverLetter: "Alskar hundar! Har egen golden retriever sa jag vet precis vad som behovs.",
    },
  });

  const acceptedApp = await prisma.application.create({
    data: {
      requestId: "req-4",
      helperId: bob.id,
      status: "ACCEPTED",
      priceProposal: 350,
      coverLetter: "Jag har hjalpt till med flera fester forut. Ar noggrann och snabb.",
    },
  });

  const booking = await prisma.booking.upsert({
    where: { id: "booking-1" },
    update: {},
    create: {
      id: "booking-1",
      requestId: "req-4",
      requesterId: carol.id,
      helperId: bob.id,
      status: "COMPLETED",
      startDate: new Date("2026-05-20T14:00:00Z"),
      endDate: new Date("2026-05-20T17:00:00Z"),
    },
  });

  await prisma.payment.upsert({
    where: { id: "payment-1" },
    update: {},
    create: {
      id: "payment-1",
      bookingId: booking.id,
      amount: 350,
      currency: "SEK",
      status: "PAID",
    },
  });

  await prisma.message.create({
    data: {
      bookingId: booking.id,
      senderId: carol.id,
      receiverId: bob.id,
      content: "Hej! Kan du komma kl 14 pa lordag?",
      createdAt: new Date("2026-05-18T10:00:00Z"),
    },
  });

  await prisma.message.create({
    data: {
      bookingId: booking.id,
      senderId: bob.id,
      receiverId: carol.id,
      content: "Hej Carol! Ja, det funkar bra. Ses da!",
      createdAt: new Date("2026-05-18T10:30:00Z"),
    },
  });

  await prisma.message.create({
    data: {
      bookingId: booking.id,
      senderId: carol.id,
      receiverId: bob.id,
      content: "Toppen! Jag bor pa Kronobergsgatan 15, portkod 1234.",
      createdAt: new Date("2026-05-18T11:00:00Z"),
    },
  });

  await prisma.review.create({
    data: {
      bookingId: booking.id,
      reviewerId: carol.id,
      revieweeId: bob.id,
      rating: 5,
      comment: "Fantastisk hjalp! Bob kom i tid, var supertrevlig och festsalen blev magisk. Rekommenderas starkt!",
    },
  });

  console.log("Seed complete!");
  console.log("Users: alice@test.se, bob@test.se, carol@test.se, david@test.se");
  console.log("Password: testtest");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
