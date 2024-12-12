/**
 * Convertit un timestamp Slack en objet Date
 * @param slackTimestamp - Timestamp Slack (format: "1512085950.000216")
 * @returns Un objet Date représentant le timestamp
 */
function slackTimestampToDate(slackTimestamp: string | number): Date {
    // Convertir en nombre à virgule flottante si c'est une chaîne
    const timestamp = typeof slackTimestamp === 'string' 
      ? parseFloat(slackTimestamp) 
      : slackTimestamp;
  
    // Multiplier par 1000 pour convertir les secondes en millisecondes
    return new Date(timestamp * 1000);
  }
  
  /**
   * Convertit un timestamp Slack en différents formats de chaîne
   * @param slackTimestamp - Timestamp Slack (format: "1512085950.000216")
   * @param format - Format de sortie souhaité
   * @returns Une représentation de la date selon le format spécifié
   */
  function formatSlackTimestamp(
    slackTimestamp: string | number, 
    format: 'iso' | 'locale' | 'utc' = 'locale'
  ): string {
    const date = slackTimestampToDate(slackTimestamp);
  
    switch(format) {
      case 'iso':
        return date.toISOString();
      case 'utc':
        return date.toUTCString();
      case 'locale':
      default:
        return date.toLocaleString();
    }
  }
  
  // Exemples d'utilisation
  function demonstrateTimestampConversion() {
    const slackTimestamp = "1512085950.000216";
  
    console.log("Date brute:", slackTimestampToDate(slackTimestamp));
    console.log("Format local:", formatSlackTimestamp(slackTimestamp));
    console.log("Format ISO:", formatSlackTimestamp(slackTimestamp, 'iso'));
    console.log("Format UTC:", formatSlackTimestamp(slackTimestamp, 'utc'));
  }
  
  // Exportation pour une utilisation externe
  export { 
    slackTimestampToDate, 
    formatSlackTimestamp 
  };