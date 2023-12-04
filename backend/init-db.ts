// Execute: npx ts-node init-db.ts

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const main = async () => {
  // Use the prisma API to fill the database with some initial data

  // Insert 5 sectors
  await prisma.sector.createMany({
    data: [
      {
        karakteristieken: 'Dal',
      },
      {
        karakteristieken: '45°',
      },
      {
        karakteristieken: '30°',
      },
      {
        karakteristieken: 'Overhang',
      },
      {
        karakteristieken: 'Recht',
      },
    ],
  })

  // Insert 30 routes, assigning them to sectors by their index in the array
  await prisma.route.createMany({
    data: [
      {
        sectorId: 1,
        grade: '4+',
        createdAt: new Date(),
      },
      {
        sectorId: 1,
        grade: '5+',
        createdAt: new Date(),
      },
      {
        sectorId: 1,
        grade: '6A',
        createdAt: new Date(),
      },
      {
        sectorId: 2,
        grade: '5',
        createdAt: new Date(),
      },
      {
        sectorId: 2,
        grade: '6B+',
        createdAt: new Date(),
      },
      {
        sectorId: 2,
        grade: '7A',
        createdAt: new Date(),
      },
      {
        sectorId: 2,
        grade: '6C',
        createdAt: new Date(),
      },
      {
        sectorId: 3,
        grade: '5',
        createdAt: new Date(),
      },
      {
        sectorId: 3,
        grade: '6A',
        createdAt: new Date(),
      },
      {
        sectorId: 3,
        grade: '4',
        createdAt: new Date(),
      },
      {
        sectorId: 4,
        grade: '6B+',
        createdAt: new Date(),
      },
      {
        sectorId: 4,
        grade: '6A',
        createdAt: new Date(),
      },
      {
        sectorId: 4,
        grade: '5',
        createdAt: new Date(),
      },
      {
        sectorId: 4,
        grade: '6C',
        createdAt: new Date(),
      },
      {
        sectorId: 5,
        grade: '6A',
        createdAt: new Date(),
      },
      {
        sectorId: 5,
        grade: '6B+',
        createdAt: new Date(),
      },
      {
        sectorId: 5,
        grade: '6C',
        createdAt: new Date(),
      },
      {
        sectorId: 5,
        grade: '7A',
        createdAt: new Date(),
      },
    ],
  })


  //Insert 5 builders
  // await prisma.builder.createMany({
  //   data: [
  //     {
  //       name: 'Jan',
  //       email: 'jan@test.be',
  //       password: '$2b$10$3zHxX03hDmD5FLaYPfdx5uczYjmhZFNR2c.KlR83PyckPbHisHR.q',
  //     },
  //     {
  //       name: 'Jef',
  //       email: 'jef@test.be',
  //       password: '$2b$10$3zHxX03hDmD5FLaYPfdx5uczYjmhZFNR2c.KlR83PyckPbHisHR.q',
  //     },
  //     {
  //       name: 'Jos',
  //       email: 'jos@test.be',
  //       password: '$2b$10$3zHxX03hDmD5FLaYPfdx5uczYjmhZFNR2c.KlR83PyckPbHisHR.q',
  //     },
  //     {
  //       name: 'Joeri',
  //       email: 'joeri@test.be',
  //       password: '$2b$10$3zHxX03hDmD5FLaYPfdx5uczYjmhZFNR2c.KlR83PyckPbHisHR.q',
  //     },
  //     {
  //       name: 'Jonas',
  //       email: 'jonas@test.be',
  //       password: '$2b$10$3zHxX03hDmD5FLaYPfdx5uczYjmhZFNR2c.KlR83PyckPbHisHR.q',
  //     },
  //   ]});

  const builder1 = await prisma.builder.create({
    data: {
        name: 'Jan',
        email: 'jan@test.be',
        password: '$2b$10$3zHxX03hDmD5FLaYPfdx5uczYjmhZFNR2c.KlR83PyckPbHisHR.q',
        routes: {
          connect:[
            {
            id: 1
            },
            {
            id: 4
            },
            {
            id: 7
            },
            {
            id: 10
            },
            {
            id: 15
            },
          ]
        }
    }
  });

  const builder2 = await prisma.builder.create({
    data: {
      name: 'Jef',
      email: 'jef@test.be',
      password: '$2b$10$3zHxX03hDmD5FLaYPfdx5uczYjmhZFNR2c.KlR83PyckPbHisHR.q',
      routes: {
        connect:[
          {
          id: 2
          },
          {
          id: 5
          },
          {
          id: 8
          },
          {
          id: 11
          },
          {
          id: 16
          },
        ]
      }
    }
  });

  const builder3 = await prisma.builder.create({
    data: {
      name: 'Jos',
      email: 'jos@test.be',
      password: '$2b$10$3zHxX03hDmD5FLaYPfdx5uczYjmhZFNR2c.KlR83PyckPbHisHR.q',
      routes: {
        connect:[
          {
            id: 3
          },
          {
            id: 6
          },
          {
            id: 9
          },
          {
            id: 12
          },
          {
            id: 17
          },
          {
            id: 10
          }
        ]
      }
    }
  });

  const builder4 = await prisma.builder.create({
    data: {
      name: 'Joeri',
      email: 'joeri@test.be',
      password: '$2b$10$3zHxX03hDmD5FLaYPfdx5uczYjmhZFNR2c.KlR83PyckPbHisHR.q',
      routes: {
        connect:[
          {
            id: 4
          },
          {
            id: 7
          },
          {
            id: 10
          },
          {
            id: 13
          },
          {
            id: 18
          }
        ]
      }
    }
  });

  const builder5 = await prisma.builder.create({
    data: {
      name: 'Jonas',
      email: 'jonas@test.be',
      password: '$2b$10$3zHxX03hDmD5FLaYPfdx5uczYjmhZFNR2c.KlR83PyckPbHisHR.q',
      routes: {
        connect:[
          {
            id: 5
          },
          {
            id: 6
          },
          {
            id: 14
          },
        ]
      }
    }
  });

  //Insert 5 climbers
  // await prisma.climber.createMany({
  //     data: [
  //       {
  //         name: 'Lowie',
  //         email: 'lowie@test.be',
  //         password: '$2b$10$3zHxX03hDmD5FLaYPfdx5uczYjmhZFNR2c.KlR83PyckPbHisHR.q',
  //         routes: {
  //           connect:[
  //             {
  //               id: 5
  //             },
  //             {
  //               id: 6
  //             }
  //           ]
  //         }
  //       },
  //       {
  //         name: 'Lars',
  //         email: 'lars@test.be',
  //         password: '$2b$10$3zHxX03hDmD5FLaYPfdx5uczYjmhZFNR2c.KlR83PyckPbHisHR.q',
  //         routes: {
  //           connect:{
  //             id: 4
  //           }
  //         }
  //       },
  //       {
  //         name: 'Lennert',
  //         email: 'lennert@test.be',
  //         password: '$2b$10$3zHxX03hDmD5FLaYPfdx5uczYjmhZFNR2c.KlR83PyckPbHisHR.q',
  //         routes: {
  //           connect:{
  //             id: 3
  //           }
  //         }
  //       },
  //       {
  //         name: 'Lander',
  //         email: 'lander@test.be',
  //         password: '$2b$10$3zHxX03hDmD5FLaYPfdx5uczYjmhZFNR2c.KlR83PyckPbHisHR.q',
  //         routes: {
  //           connect:{
  //             id: 2
  //           }
  //         }
  //       },
  //       {
  //         name: 'Liam',
  //         email: 'liam@test.be',
  //         password: '$2b$10$3zHxX03hDmD5FLaYPfdx5uczYjmhZFNR2c.KlR83PyckPbHisHR.q',
  //         routes: {
  //           connect:{
  //             id: 1
  //           }
  //         }
  //       },
  //     ]});

  const climber1 = await prisma.climber.create({
    data: {
      name: 'Lowie',
      email: 'lowie@test.be',
      password: '$2b$10$3zHxX03hDmD5FLaYPfdx5uczYjmhZFNR2c.KlR83PyckPbHisHR.q',
      routes: {
        connect:[
          {
            id: 5
          },
          {
            id: 6
          },
          {
            id: 15
          }
        ]
      }
    }
  });

    const climber2 = await prisma.climber.create({
        data: {
          name: 'Lars',
          email: 'lars@test.be',
          password: '$2b$10$3zHxX03hDmD5FLaYPfdx5uczYjmhZFNR2c.KlR83PyckPbHisHR.q',
          routes: {
            connect:[
              {
                id: 4
              },
              {
                id: 7
              },
              {
                id: 11
              }
            ]
          }
        }
    });

    const climber3 = await prisma.climber.create({
        data: {
          name: 'Lennert',
          email: 'lennert@test.be',
          password: '$2b$10$3zHxX03hDmD5FLaYPfdx5uczYjmhZFNR2c.KlR83PyckPbHisHR.q',
          routes: {
            connect:[
              {
              id: 3
              },
              {
                id: 8
              },
              {
                id: 12
              }
            ]
          }
        }
    });

    const climber4 = await prisma.climber.create({
        data: {
          name: 'Lander',
          email: 'lander@test.be',
          password: '$2b$10$3zHxX03hDmD5FLaYPfdx5uczYjmhZFNR2c.KlR83PyckPbHisHR.q',
          routes: {
            connect:[
              {
                id: 2
              },
              {
                id: 9
              },
              {
                id: 13
              },
              {
                id: 16
              }
            ]
          }
        }
    });

    const climber5 = await prisma.climber.create({
        data: {
          name: 'Liam',
          email: 'liam@test.be',
          password: '$2b$10$3zHxX03hDmD5FLaYPfdx5uczYjmhZFNR2c.KlR83PyckPbHisHR.q',
          routes: {
            connect:[
              {
                id: 1
              },
              {
                id: 10
              },
              {
                id: 14
              }
            ]
          }
        }
    });
  const climber6 = await prisma.climber.create({
    data: {
      name: 'Jan',
      email: 'jan@test.be',
      password: '$2b$10$3zHxX03hDmD5FLaYPfdx5uczYjmhZFNR2c.KlR83PyckPbHisHR.q',
      routes: {
        connect:[
          {
            id: 1
          },
          {
            id: 4
          },
          {
            id: 7
          },
          {
            id: 10
          },
          {
            id: 15
          },
        ]
      }
    }
  });

  const climber7 = await prisma.climber.create({
    data: {
      name: 'Jef',
      email: 'jef@test.be',
      password: '$2b$10$3zHxX03hDmD5FLaYPfdx5uczYjmhZFNR2c.KlR83PyckPbHisHR.q',
      routes: {
        connect:[
          {
            id: 2
          },
          {
            id: 5
          },
          {
            id: 8
          },
          {
            id: 11
          },
          {
            id: 16
          },
        ]
      }
    }
  });

  const climber8 = await prisma.climber.create({
    data: {
      name: 'Jos',
      email: 'jos@test.be',
      password: '$2b$10$3zHxX03hDmD5FLaYPfdx5uczYjmhZFNR2c.KlR83PyckPbHisHR.q',
      routes: {
        connect:[
          {
            id: 3
          },
          {
            id: 6
          },
          {
            id: 9
          },
          {
            id: 12
          },
          {
            id: 17
          },
          {
            id: 10
          }
        ]
      }
    }
  });

  const climber9 = await prisma.climber.create({
    data: {
      name: 'Joeri',
      email: 'joeri@test.be',
      password: '$2b$10$3zHxX03hDmD5FLaYPfdx5uczYjmhZFNR2c.KlR83PyckPbHisHR.q',
      routes: {
        connect:[
          {
            id: 4
          },
          {
            id: 7
          },
          {
            id: 10
          },
          {
            id: 13
          },
          {
            id: 18
          }
        ]
      }
    }
  });

  const climber10 = await prisma.climber.create({
    data: {
      name: 'Jonas',
      email: 'jonas@test.be',
      password: '$2b$10$3zHxX03hDmD5FLaYPfdx5uczYjmhZFNR2c.KlR83PyckPbHisHR.q',
      routes: {
        connect:[
          {
            id: 5
          },
          {
            id: 6
          },
          {
            id: 14
          },
        ]
      }
    }
  });

  console.log('Data inserted!')
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
