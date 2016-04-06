<?php
/**
 * PHP version 5
 *
 * @category    Genomic
 * @package     Main
 * @author      Loris team <info-loris.mni@mcgill.ca>
 * @contributor Xavier <xavier.lecoursboucher@mcgill.ca>
 * @license     http://www.gnu.org/licenses/gpl-3.0.txt @GPLv3
 * @link        https://www.github.com/aces/Loris/
 */

require_once 'NDB_Menu_Filter.class.inc';
/**
 * NDB_Menu_Filter_genomic_file_uploader Class
 *
 * This class is to provide a uploader tool to keep genomic
 * files into LORIS.
 *
 * @category    Genomic
 * @package     Main
 * @author      Loris team <info-loris.mni@mcgill.ca>
 * @contributor Xavier <xavier.lecoursboucher@mcgill.ca>
 * @license     http://www.gnu.org/licenses/gpl-3.0.txt @GPLv3
 * @link        https://github.com/aces/Loris
*/
class NDB_Menu_Filter_Genomic_File_Uploader extends NDB_Menu_Filter
{

    var $AjaxModule = true;

    /**
     * Overloading this method to allow access to site users (own site only)
     * and users w/ multisite privileges
     *
     * @note   overloaded function
     * @return bool
     */
    function _hasAccess()
    {
        // create user object
        $user = User::singleton();
        return ($user->hasPermission('genomic_browser_view_allsites')
                || $user->hasPermission('genomic_browser_view_site'));
    }


    /**
     * Function _setupVariables
     *
     * @note   overloaded function
     * @return bool
    */
    function _setupVariables()
    {
        // set the class variables
        $this->_displayBrief = !(isset($_REQUEST['format']));
        $this->columns       = array(
                                'GenomicFileID',
                                'FileName',
                                'Description',
                                'FileType',
                                'Date_inserted',
                                'InsertedByUserID',
                                'Caveat',
                                'Notes',
                               );

        // Chromosome from genome_loc table
        // INNER JOIN on table.
        // If a candidate has no CPG records, they will not appear.
        $this->query = " FROM genomic_files WHERE 1=1 ";

        $this->validFilters = array(
                               'GenomicFileID',
                               'FileName',
                               'Description',
                               'FileType',
                               'Date_inserted',
                               'InsertedByUserID',
                               'Caveat',
                               'Notes',
                              );

        $this->formToFilter = array(
                               'file_name'         => 'FileName',
                               'description'       => 'Description',
                               'genomic_file_type' => 'FileType',
                               'date_inserted'     => 'Date_inserted',
                               'caveat'            => 'Caveat',
                               'notes'             => 'Notes',
                              );

        $this->EqualityFilters = array(
                                  'FileType',
                                  'Caveat',
                                 );

        return true;
    }

    /**
     * Sets the template data for the filter form
     *
     * @note   overloaded function
     * @return bool
     */
    function _setFilterForm()
    {
        // ------------------------------------------------------------
        // ----------------- Genomic Files Filters --------------------
        // ------------------------------------------------------------

        $this->addBasicText('file_name', 'Name:');

        $this->addBasicText('description', 'Description:');

        $this->addBasicText('date_inserted', 'Date inserted:');

        $this->addBasicText('notes', 'Notes:');

        $this->addBasicText('genomic_file_type', 'Type:');

        $Base_options = $this->getDistinctValues(
            'genomic_files',
            'Caveat'
        );
        $this->addCheckbox('caveat', 'Caveat:', $Base_options);

        $user = User::singleton();
        $this->tpl_data['user'] = $user->getUsername();

        return true;
    }

    /**
     * Include the column formatter required to display the feedback link colours
     * in the candidate_list menu
     *
     * @return array of javascript to be inserted
     */
    function getJSDependencies()
    {
        $factory = NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $deps    = parent::getJSDependencies();
        return array_merge(
            $deps,
            array(
             $baseURL . "/genomic_browser/js/genomic_browser.js",
             $baseURL . "/genomic_browser/js/genomic_file_uploader.js",
             $baseURL . "/genomic_browser/js/FileUploadModal.js",
            )
        );
    }

    /**
     * Provide an array of distinct value from a column in
     * the specified table. The first element has a null key and
     * its value is 'Any'.
     *
     * @param string $table  The tables name
     * @param string $column The column name
     *
     * @return array An array where value are keys as well as values
     */
    function getDistinctValues( $table, $column)
    {
        $DB      = Database::singleton();
        $results = $DB->pselect(
            "SELECT DISTINCT $column FROM $table ",
            array()
        );
        return array_reduce(
            $results,
            function ($carry, $item) {
                $value = array_values($item)[0];
                if (!empty($value)) {
                    $carry[str_replace(' ', '_', $value)] = $value;
                }
                return $carry;
            },
            array(null => 'Any')
        );

    }
}
?>