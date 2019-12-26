exports.run = (client, message, args) => {
    message.channel.send({embed: {
    color: 3447003,
    title: `Current Commands:`,
    description: `**!(pick one:wiki, wikia, cirno, mal) query** -- search within site using google ex:(!wikia okita souji)
**quick resource links:**
**!dropsheet** -- has non-event mat droprates
**!drops** -- slightly cooler version of dropsheet, not nice to phones
**!forecast** -- upcoming event materials by twitch.tv/xzero20
**!guide** -- guide for current(NA) event
**!info** -- infographic for current(NA) event
**!support** -- support list suggestions for current(NA) event
**!jpguide !jpmap !jpsupport** same as above for jp version
**!banners** -- upcoming banners by servant(NA)
**!starters** -- document suggesting good early units for new players
**submissions** -- link to submission sheet for current(NA) event drops
**!npdmg** -- links to ~~xeo's~~ infernal's na np damage chart on the wikia
**!npdmgjp** -- same but JP, done by ein inferno
**!compatibility** -- fgo compatibility
**!sos** -- account recovery guide
**!faq** -- good newcomer resource


**!help** -- more instructions and arguments for **!test**, which is used to calculate servant np damage
**!stats** -- list servant stats by nickname or ID '!stats okita or '!stats 115'
**!getnames** -- list nicknames by nickname or ID
`,
      
    }
    });
};