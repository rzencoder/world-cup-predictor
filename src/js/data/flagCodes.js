const flagCodes = [{code3: 'AUS', code2: 'au'}, {code3: 'ARG', code2: 'ar'}, {code3: 'RUS', code2: 'ru'}, {code3: 'KSA', code2: 'sa'},
{code3: 'EGY', code2: 'eg'}, {code3: 'URU', code2: 'uy'}, {code3: 'POR', code2: 'pt'}, {code3: 'ESP', code2: 'es'}, 
{code3: 'MAR', code2: 'ma'}, {code3: 'IRN', code2: 'ir'}, {code3: 'FRA', code2: 'fr'}, {code3: 'PER', code2: 'pe'}, 
{code3: 'DEN', code2: 'dk'}, {code3: 'ISL', code2: 'is'}, {code3: 'CRO', code2: 'hr'}, {code3: 'NGA', code2: 'ng'}, 
{code3: 'BRA', code2: 'br'}, {code3: 'SUI', code2: 'ch'}, {code3: 'CRC', code2: 'cr'}, {code3: 'SRB', code2: 'rs'}, 
{code3: 'GER', code2: 'de'}, {code3: 'MEX', code2: 'mx'}, {code3: 'SWE', code2: 'se'}, {code3: 'KOR', code2: 'kr'}, 
{code3: 'BEL', code2: 'be'}, {code3: 'PAN', code2: 'pa'}, {code3: 'TUN', code2: 'tn'}, {code3: 'ENG', code2: 'gb-eng'}, 
{code3: 'POL', code2: 'pl'}, {code3: 'SEN', code2: 'sn'}, {code3: 'COL', code2: 'co'}, {code3: 'JPN', code2: 'jp'},
{code3: 'NED', code2: 'nl'}, {code3: 'ITA', code2: 'it'}, {code3: 'ECU', code2: 'ec'}, {code3: 'ALG', code2: 'dz'}, 
{code3: 'CMR', code2: 'cm'}, {code3: 'GRE', code2: 'gr'}, {code3: 'HON', code2: 'hn'}, {code3: 'BIH', code2: 'ba'},
{code3: 'CIV', code2: 'ci'}, {code3: 'USA', code2: 'us'}, {code3: 'CHI', code2: 'cl'} , {code3: 'GHA', code2: 'gh'}
];

//Converter data from api from 3 digit to 2 digit code so able to use the svg flags

const codeConverter = code => {
  const flagCode = flagCodes.filter(el => {
    return el.code3 === code;
  });
  return flagCode[0].code2;
}

export default codeConverter;