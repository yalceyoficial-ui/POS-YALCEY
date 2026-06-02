const {PrismaClient} = require('@prisma/client'); const p = new PrismaClient(); p.user.findMany().then(u =, null, 2))).finally(() =
