/**
 * Filter a specific numeric column on the value being between two given
 * numbers. Note that you will likely need to change the id's on the inputs
 * and the column in which the numeric value is given.
 *
 *  @summary Filter the data between two numbers (inclusive)
 *  @name Range filtering (numbers)
 *  @author [Allan Jardine](http://sprymedia.co.uk)
 *
 *  @example
 *    $(document).ready(function() {
 *        // Initialise datatables
 *        var table = $('#example').DataTable();
 *
 *        // Add event listeners to the two range filtering inputs
 *        $('#min').keyup( function() { table.draw(); } );
 *        $('#max').keyup( function() { table.draw(); } );
 *    } );
 */

jQuery.fn.dataTableExt.afnFiltering.push(
  function( oSettings, aData, iDataIndex ) {

    //Value of min and max for the peptide sequence
    var iMin = document.getElementById('min').value * 1;
    var iMax = document.getElementById('max').value * 1;

    //Limit value for the HLA frequency
    var iLimit = document.getElementById('freq_limit').value *1;

    //Length of the sequence
    if (aData[4] != undefined){
      var iLength = aData[4].length;
    }else {
      var iLength = 0;
    }

    //Check if the frequence is indeed a number or set it to 0
    if (isNaN(aData[3])){
    } else {
      var iFreq = aData[3];
    }



    if (iLimit === 0 || iFreq >= iLimit){

      if ( iMin === 0 && iMax === 0 )
      {
        return true;
      }

      else if ( iMin === 0 && iLength <= iMax )
      {
        return true;
      }
      else if ( iMin <= iLength && 0 === iMax )
      {
        return true;
      }
      else if ( iMin <= iLength && iLength <= iMax )
      {
        return true;
      }
      return false;

    } else {
      return false;
    }

  }
);
