module.exports.addTeamStaffRelationship = (
  knex,
  numTeams,
  numStaff,
  numSemesters,
) => {
  if (numSemesters !== 1) {
    throw new Error(
      'This function only supports a single semester at the moment' +
        ' it needs to be modified if you need it to support several semesters',
    );
  }
  const rows = [];
  let id = 0;
  for (let teamId = 1; teamId <= numTeams; teamId++) {
    const numStaffInTeam = [];
    for (let k = 0; k < numTeams; k++) {
      numStaffInTeam.push(0);
    }
    for (let staffId = 1; staffId <= numStaff; staffId++) {
      const staffInTeam = ((staffId - 1) % numTeams) + 1 === teamId;
      if (staffInTeam) {
        id += 1;
        const teamOrder = teamId - 1;
        const staffOrder = numStaffInTeam[teamOrder];
        numStaffInTeam[teamOrder] += 1;
        rows.push({
          id,
          team_id: teamId,
          staff_id: staffId,
          team_order: teamOrder,
          staff_order: staffOrder,
          semester_id: 1,
        });
      }
    }
  }
  return knex('teams_staff').insert(rows);
};
