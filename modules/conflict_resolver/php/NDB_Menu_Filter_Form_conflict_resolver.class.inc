<?php
/**
 * This class provides the php code to create the menu filter form that
 * allows unresolved conflicts to be processed as part of the conflict resolver
 *
 * PHP Version 5
 *
 * @category Behavioural
 * @package  Main
 * @author   Tara Campbell <tara.campbell@mail.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */

/**
 * Menu_Filter_Form_Conflicts_Resolver Class
 *
 * This class provides the php code to create the menu filter form that
 * allows unresolved conflicts to be processed as part of the conflict resolver
 *
 * @category Behavioural
 * @package  Main
 * @author   Tara Campbell <tara.campbell@mail.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class NDB_Menu_Filter_Form_Conflict_Resolver extends NDB_Menu_Filter_Form
{

    /**
     * Returns true if the user has permission to access
     * the conflict resolver module
     *
     * @return true if user has permission
     */
    function _hasAccess()
    {
        // create user object
        $user =& User::singleton();
        return ($user->hasPermission('conflict_resolver'));
    }

    /**
     * Processes the conflicts that were submitted for resolution and re-runs
     * the appropriate scoring algorithm
     *
     * @param array $values The values submitted from the form
     *
     * @return none
     */
    function _process($values)
    {
        if (!is_array($values) || count($values) == 0) {
            return true;
        }

        $DB =& Database::singleton();

        $user =& User::singleton();

        foreach ($values AS $key => $val) {
            // The only valid values are 1, 2 or none.  Therefore we are only
            // allowing an update if 1 or 2 rather than different from none.
            if (($val == 1) || ($val == 2)) {
                $hash = $key;
                $row  = $DB->pselectRow(
                    "SELECT cr.ConflictID, cr.TableName, cr.ExtraKeyColumn,
                    cr.ExtraKey1, cr.ExtraKey2, cr.FieldName, cr.CommentId1,
                    cr.Value1, cr.CommentId2, cr.Value2, c.ProjectID
                    FROM conflicts_unresolved cr
                    JOIN flag f ON (cr.CommentId1=f.CommentID)
                    JOIN session s ON (f.SessionID=s.ID)
                    JOIN candidate c ON (c.CandID=s.CandID)
                    WHERE MD5(CONCAT_WS(':',TableName, ExtraKeyColumn, ExtraKey1,
                        ExtraKey2, FieldName, CommentId1, CommentId2)) = :hash",
                    array('hash' => $hash)
                );
                if (!empty($row)) {

                    // insert into conflicts_resolved
                    $user1         = $DB->pselectOne(
                        "SELECT UserID FROM flag WHERE CommentID=:CID",
                        array('CID' => $row['CommentId1'])
                    );
                    $user2         = $DB->pselectOne(
                        "SELECT UserID FROM flag WHERE CommentID=:CID",
                        array('CID' => $row['CommentId2'])
                    );
                    $resolutionLog = array(
                                      'UserID'         => $user->getUsername(),
                                      'User1'          => $user1,
                                      'User2'          => $user2,
                                      'TableName'      => $row['TableName'],
                                      'ExtraKeyColumn' => $row['ExtraKeyColumn'],
                                      'ExtraKey1'      => $row['ExtraKey1'],
                                      'ExtraKey2'      => $row['ExtraKey2'],
                                      'FieldName'      => $row['FieldName'],
                                      'CommentId1'     => $row['CommentId1'],
                                      'CommentId2'     => $row['CommentId2'],
                                      'OldValue1'      => $row['Value1'],
                                      'OldValue2'      => $row['Value2'],
                                      'NewValue'       => $val,
                                      'ConflictID'     => $row['ConflictID'],
                                     );

                    $DB->insert('conflicts_resolved', $resolutionLog);

                    // update the source tables
                    $setArray    = array(
                                    $row['FieldName'] => (
                        $val == '1' ? $row['Value1'] : $row['Value2']
                                    ),
                                   );
                    $whereArray1 = array('CommentID' => $row['CommentId1']);
                    $whereArray2 = array('CommentID' => $row['CommentId2']);
                    if ($row['ExtraKeyColumn'] != null) {
                        $whereArray1[$row['ExtraKeyColumn']] = $row['ExtraKey1'];
                        $whereArray2[$row['ExtraKeyColumn']] = $row['ExtraKey2'];
                    }
                    $DB->update($row['TableName'], $setArray, $whereArray1);
                    $DB->update($row['TableName'], $setArray, $whereArray2);

                    // delete from conflicts_unresolved
                    $DB->run(
                        "DELETE FROM conflicts_unresolved
                        WHERE MD5(
                            CONCAT_WS(':',TableName, ExtraKeyColumn, ExtraKey1,
                            ExtraKey2, FieldName, CommentId1, CommentId2)
                        ) = '$hash'"
                    );

                    $TableName = $row['TableName'];
                    $date      = explode('-', $setArray['Date_taken']);
                    $dateArray = array(
                                  'Y' => $date[0],
                                  'M' => $date[1],
                                  'd' => $date[2],
                                 );

                    $Instrument = NDB_BVL_Instrument::factory(
                        $TableName,
                        $row['CommentId1'],
                        '',
                        false
                    );
                    if ($Instrument != null) {
                        //calculate candidate age if Date_taken was changed
                        if ($row['FieldName'] == 'Date_taken') {
                            $Instrument->_saveValues(
                                array('Date_taken' => $dateArray)
                            );
                        }

                        $Instrument->score();
                        // Score runs the update statements to update the scored
                        // columns. There's no need to save, (and save() doesn't
                        // work) because it calls $this->form->getSubmittedValues(),
                        // and at this point we're submitting the conflict resolver,
                        // not the instrument
                    }

                    $Instrument = NDB_BVL_Instrument::factory(
                        $TableName,
                        $row['CommentId2'],
                        '',
                        false
                    );
                    if ($Instrument != null) {
                        //calculate candidate age if Date_taken was changed
                        if ($row['FieldName'] == 'Date_taken') {
                            $Instrument->_saveValues(
                                array('Date_taken' => $dateArray)
                            );
                        }

                        $Instrument->score();
                    }
                }
            }
        }

        $this->tpl_data['success'] = true;
    }

    /**
     * Sets up the class variables required to render the query for the
     * conflict resolver
     *
     * @return none
     */
    function _setupVariables()
    {

        $config =& NDB_Config::singleton();

        // set the class variables
        $useProjects = $config->getSetting("useProjects");
        if ($useProjects === "false") {
            $useProjects = false;
            $this->tpl_data['useProjects'] ='false';
        } else {
            // add 1 to colspan in menu_resolved_conflicts.tpl if using project
            // to account for "Projects" header
            $this->tpl_data['useProjects'] ='true';
        }

        // set the class variables
        $this->columns = array(
                          'conflicts_unresolved.TableName as Instrument',
                          'session.CandID as CandID',
                          'candidate.PSCID as PSCID',
                          'session.Visit_label as Visit_Label',
                         );

        if ($useProjects) {
            $this->columns[] = 'Project.Name as Project';
        }

        $this->columns = array_merge(
            $this->columns,
            array(
             'conflicts_unresolved.FieldName as Question',
             '"" as Correct_Answer',
             'conflicts_unresolved.Value1 as Value1',
             'conflicts_unresolved.Value2 as Value2',
             "MD5(
                    CONCAT_WS(
                        ':',
                        conflicts_unresolved.TableName,
                        conflicts_unresolved.ExtraKeyColumn,
                        conflicts_unresolved.ExtraKey1,
                        conflicts_unresolved.ExtraKey2,
                        conflicts_unresolved.FieldName,
                        conflicts_unresolved.CommentId1,
                        conflicts_unresolved.CommentId2
                    )
                )
                as Hash",
            )
        );

        $this->query = " FROM conflicts_unresolved
            LEFT JOIN flag ON (conflicts_unresolved.CommentId1=flag.CommentID)
            LEFT JOIN session ON (flag.SessionID=session.ID)
            LEFT JOIN candidate ON (candidate.CandID=session.CandID)
            LEFT JOIN Project ON (candidate.ProjectID=Project.ProjectID )
            WHERE 1=1";

        $user = User::singleton();
        if (!$user->hasPermission('access_all_profiles')) {
            // restrict data to own site
            $this->query .= " AND candidate.CenterID=";
            $this->query .= $user->getCenterID();
        }

        $this->group_by     = '';
        $this->order_by     = 'conflicts_unresolved.TableName, session.Visit_label';
        $this->validFilters = array(
                               'conflicts_unresolved.TableName',
                               'session.CenterID',
                               'session.Visit_label',
                              );

        if ($useProjects) {
            $this->validFilters[] = 'candidate.ProjectID';
        }

        $this->validFilters = array_merge(
            $this->validFilters,
            array(
             'candidate.PSCID',
             'session.CandID',
             'conflicts_unresolved.Fieldname',
            )
        );
        $this->headers      = array(
                               'Instrument',
                               'CandID',
                               'PSCID',
                               'Visit_label',
                              );

        if ($useProjects) {
            $this->headers = array_merge(
                $this->headers,
                array('Project')
            );
        }

        $this->headers =array_merge(
            $this->headers,
            array(
             'Question',
             'Correct Answer',
             'Value1',
             'Value2',
             'Hash',
            )
        );
        $this->tpl_data['hiddenHeaders'] = json_encode(['Value1', 'Value2', 'Hash']);
        $this->formToFilter = array(
                               'Instrument' => 'conflicts_unresolved.TableName',
                               'site'       => 'session.CenterID',
                               'visit'      => 'session.Visit_label',
                              );

        if ($useProjects) {
            $this->formToFilter = array_merge(
                $this->formToFilter,
                array('Project' => 'candidate.ProjectID')
            );
        }

        $this->formToFilter = array_merge(
            $this->formToFilter,
            array(
             'CandID'   => 'session.CandID',
             'PSCID'    => 'candidate.PSCID',
             'Question' => 'conflicts_unresolved.Fieldname',
            )
        );

        return true;
    }

    /**
     * Sets up the smarty menu filter items for the conflict resolver
     *
     * @return none
     */
    function _setFilterForm()
    {
        // Create user object
        $user =& User::singleton();

        $config =& NDB_Config::singleton();

        // Get instruments
        $instruments = Utility::getAllInstruments();
        $instruments = array_merge(array('' => 'All Instruments'), $instruments);

        // Get visits
        $visits = Utility::getVisitList();
        $visits = array_merge(array('' => 'All'), $visits);

        // Get sites
        if ($user->hasPermission('access_all_profiles')) {
            // get the list of study sites - to be replaced by the Site object
            $sites = Utility::getSiteList();
            if (is_array($sites)) {
                $sites = array('' => 'All') + $sites;
            }
        } else {
            // allow only to view own site data
            $site =& Site::singleton($user->getData('CenterID'));
            if ($site->isStudySite()) {
                $sites = array($user->getData('CenterID') => $user->getData('Site'));
            }
        }

        // Add form elements
        $this->addSelect('site', 'Site:', $sites);
        $this->addSelect('Instrument', 'Instrument:', $instruments);
        $this->addSelect('visit', 'Visit label:', $visits);
        $this->addBasicText(
            'CandID',
            'DCCID:',
            array(
             "size"      => 9,
             "maxlength" => 6,
            )
        );
        $this->addBasicText(
            'PSCID',
            'PSCID:',
            array(
             "size"      => 9,
             "maxlength" => 7,
            )
        );
        $this->addBasicText('Question', 'Search keyword:');

        // Project list, if applicable
        if ($config->getSetting("useProjects")==="true") {
            $list_of_projects = array(null => 'All');
            $projectList      = Utility::getProjectList();
            foreach ($projectList as $key => $value) {
                $list_of_projects[$key] = $value;
            }
            $this->addSelect('Project', 'Project: ', $list_of_projects);
        }

        return true;
    }

    /**
     * Gathers JS dependecies and merge them with the parent
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
            array($baseURL . "/conflict_resolver/js/unresolved_columnFormatter.js")
        );
    }
}

?>
