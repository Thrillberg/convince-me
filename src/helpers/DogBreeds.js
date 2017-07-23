export default {
  getBreed() {
    const breeds = [
      'Abruzzenhund',
      'Affenpinscher',
      'AfghanHound',
      'Africanis',
      'Aidi',
      'AinuDog',
      'AiredaleTerrier',
      'AkbashDog',
      'Akitas',
      'Akita',
      'AkitaInu',
      'AlanoEspañol',
      'AlapahaBlueBloodBulldog',
      'AlaskanHusky',
      'AlaskanKleeKai',
      'AlaskanMalamute',
      'Alopekis',
      'AlpineDachsbracke',
      'AmericanAllaunt',
      'AmericanAlsatian',
      'AmericanBlackandTanCoonhound',
      'AmericanBlueGasconHound',
      'AmericanBlueLacy',
      'AmericanBullMolosser',
      'AmericanBulldog',
      'AmericanBullnese',
      'AmericanBully',
      'AmericanCockerSpaniel',
      'AmericanCrestedSandTerrier',
      'AmericanEnglishCoonhound',
      'AmericanEskimoDog',
      'AmericanFoxhound',
      'AmericanHairlessTerrier',
      'AmericanIndianDog',
      'AmericanLo-SzePugg',
      'AmericanMastiff',
      'AmericanMastiff(Panja)',
      'AmericanPitBullTerrier',
      'AmericanStaffordshireTerrier',
      'AmericanStaghound',
      'AmericanToyTerrier',
      'AmericanTundraShepherdDog',
      'AmericanWaterSpaniel',
      'AmericanWhiteShepherd',
      'AnatolianShepherdDog',
      'AndalusianPodenco',
      'Anglos-Françaises',
      'Anglos-FrançaiGrand',
      'Anglos-FrançaisesdeMoyenneVenerie',
      'Anglos-FrançaisesdePetiteVenerie',
      'AppenzellMountainDog',
      'AriegePointingDog',
      'Ariegeois',
      'Armant',
      'AryanMolossus',
      'ArgentineDogo',
      'ArmenianGampr',
      'AtlasTerrier',
      'AustralianBandog',
      'AustralianBulldog',
      'AustralianCattleDog',
      'AustralianCobberdog',
      'AustralianKelpie',
      'AustralianKoolie',
      'AustralianLabradoodle',
      'AustralianShepherd',
      'AustralianStumpyTailCattleDog',
      'AustralianTerrier',
      'AustrianBlackandTanHound',
      'AustrianBrandlbracke',
      'AustrianShorthairedPinscher',
      'AuvergnePointingDog',
      'Azawakh',
    ];

    const breed = breeds[Math.floor(Math.random() * breeds.length)];
    return breed;
  }
};
