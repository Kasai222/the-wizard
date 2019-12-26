exports.run = (client, message, args) => {
    message.channel.send({embed: {
    color: 3447003,
    title: `Card sim:`,
    description: `
**'buster' 'arts' 'quick'** - changes card type (passive cardmod should update) and removes np multiplier
**'bf'** - buster first card bonus
**'busterchain' 'bbb'** - adds 20% of the total(base+ce+fou) atk as flat damage -- implies bf
**'second' 'third'** - card position multiplier
**'crit'** - use to calculate crits, should auto include crit damage passives (crit damage buffs are powermod)

none of these work on NP's in game
`,
      
    }
    });
};