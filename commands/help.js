exports.run = (client, message, args) => {
    message.channel.send({embed: {
    color: 3447003,
    title: `Current Command Examples:`,
    description: `**!(pick one:wiki, wikia, cirno, mal) query** -- search within site using google
**!addname alias id** -- maps a nickname to a servant id

**!test servant(numeric id or nickname)** tests np damage for servant by id or nickname
**arguments for test:**
**fou/f** -- sets fou value, default 990
**ce/c** -- sets atk from ce, default 0
**np1-5** -- sets np level, default 5
**cardmod/m** -- damage up for cardtype %(ex 50% manaburst = cardmod50)
**atkmod/atk/attack/a** -- atk up %(ex 30% atk from waver skill = atk30)
**defmod/def/defense/d** -- defense mod for target(def-30% for 30% defense down)
**npmod/n** -- np damage up(npmod80 for mlb black grail)
**powermod/power/p** -- powermod is typically strength up vs xxx or from event ce's, will apply to cards also
**supereffectivemod/se/super/s** -- extra bonus damage on np vs trait(gil, carmilla, rama) works on only np
**flatdamage/ad/fd/dmg** -- raw damage added at the end, usually fd500 from waver's skill
**level/lvl/lv/l** -- level of attacking servant, default is max without grails
**strengthen/str/lewd/interlude** -- str1 for np interlude str0 for no interlude, defaults typically match na availability
**npvalue/npv/npoverride** -- manually set np damage %, used to account for weird oc like arash mostly
**class or attribute for opponent** -- ex 'saber', 'sky', or 'alterego', will default to neutral damage

you can also add 'v' or 'verbose' to have it spit out all the variables`,
      
    }
    });
};