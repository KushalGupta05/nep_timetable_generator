import React from 'react';
import Icon from '../../../components/AppIcon';

const WorkloadSummary = ({ faculty }) => {
  const getTotalWorkload = () => {
    return faculty?.reduce((total, member) => total + member?.workloadHours, 0);
  };

  const getAverageWorkload = () => {
    if (faculty?.length === 0) return 0;
    return Math.round(getTotalWorkload() / faculty?.length);
  };

  const getWorkloadDistribution = () => {
    const distribution = {
      underloaded: 0,  // < 50% of max
      optimal: 0,      // 50-75% of max
      high: 0,         // 75-90% of max
      overloaded: 0    // > 90% of max
    };

    faculty?.forEach(member => {
      const percentage = (member?.workloadHours / member?.maxWorkload) * 100;
      if (percentage < 50) distribution.underloaded++;
      else if (percentage < 75) distribution.optimal++;
      else if (percentage < 90) distribution.high++;
      else distribution.overloaded++;
    });

    return distribution;
  };

  const getDepartmentWorkload = () => {
    const departments = {};
    faculty?.forEach(member => {
      if (!departments?.[member?.department]) {
        departments[member.department] = {
          totalHours: 0,
          facultyCount: 0,
          maxCapacity: 0
        };
      }
      departments[member.department].totalHours += member?.workloadHours;
      departments[member.department].facultyCount += 1;
      departments[member.department].maxCapacity += member?.maxWorkload;
    });

    return Object.entries(departments)?.map(([dept, data]) => ({
      department: dept,
      ...data,
      utilization: Math.round((data?.totalHours / data?.maxCapacity) * 100)
    }));
  };

  const getTopLoadedFaculty = () => {
    return faculty?.map(member => ({
        ...member,
        utilization: Math.round((member?.workloadHours / member?.maxWorkload) * 100)
      }))?.sort((a, b) => b?.utilization - a?.utilization)?.slice(0, 5);
  };

  const totalWorkload = getTotalWorkload();
  const averageWorkload = getAverageWorkload();
  const distribution = getWorkloadDistribution();
  const departmentData = getDepartmentWorkload();
  const topLoaded = getTopLoadedFaculty();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {/* Overall Statistics */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name="BarChart3" size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Overall Statistics</h3>
            <p className="text-sm text-muted-foreground">System-wide workload metrics</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Total Faculty</span>
            <span className="text-lg font-semibold text-foreground">{faculty?.length}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Total Hours</span>
            <span className="text-lg font-semibold text-foreground">{totalWorkload}h</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Average Load</span>
            <span className="text-lg font-semibold text-foreground">{averageWorkload}h</span>
          </div>
          <div className="pt-3 border-t border-border">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">System Utilization</span>
              <span className="font-medium text-foreground">
                {faculty?.length > 0 ? Math.round((totalWorkload / faculty?.reduce((sum, f) => sum + f?.maxWorkload, 0)) * 100) : 0}%
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* Workload Distribution */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
            <Icon name="PieChart" size={20} className="text-accent" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Load Distribution</h3>
            <p className="text-sm text-muted-foreground">Faculty workload categories</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-muted rounded-full" />
              <span className="text-sm text-muted-foreground">Underloaded</span>
            </div>
            <span className="text-sm font-medium text-foreground">{distribution?.underloaded}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-success rounded-full" />
              <span className="text-sm text-muted-foreground">Optimal</span>
            </div>
            <span className="text-sm font-medium text-foreground">{distribution?.optimal}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-warning rounded-full" />
              <span className="text-sm text-muted-foreground">High Load</span>
            </div>
            <span className="text-sm font-medium text-foreground">{distribution?.high}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-error rounded-full" />
              <span className="text-sm text-muted-foreground">Overloaded</span>
            </div>
            <span className="text-sm font-medium text-foreground">{distribution?.overloaded}</span>
          </div>
        </div>
      </div>
      {/* Department Utilization */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
            <Icon name="Building2" size={20} className="text-secondary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Department Load</h3>
            <p className="text-sm text-muted-foreground">Utilization by department</p>
          </div>
        </div>

        <div className="space-y-3 max-h-48 overflow-y-auto">
          {departmentData?.map((dept) => (
            <div key={dept?.department} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">{dept?.department}</span>
                <span className="text-sm text-muted-foreground">{dept?.utilization}%</span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    dept?.utilization >= 90 ? 'bg-error' :
                    dept?.utilization >= 75 ? 'bg-warning' : 'bg-success'
                  }`}
                  style={{ width: `${Math.min(dept?.utilization, 100)}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{dept?.facultyCount} faculty</span>
                <span>{dept?.totalHours}/{dept?.maxCapacity}h</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Top Loaded Faculty */}
      <div className="bg-card rounded-lg border border-border p-6 lg:col-span-2 xl:col-span-3">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
            <Icon name="TrendingUp" size={20} className="text-warning" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Highest Workload Faculty</h3>
            <p className="text-sm text-muted-foreground">Faculty members with highest utilization rates</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-3 text-sm font-medium text-muted-foreground">Faculty</th>
                <th className="text-left p-3 text-sm font-medium text-muted-foreground">Department</th>
                <th className="text-left p-3 text-sm font-medium text-muted-foreground">Current Load</th>
                <th className="text-left p-3 text-sm font-medium text-muted-foreground">Utilization</th>
                <th className="text-left p-3 text-sm font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {topLoaded?.map((member) => (
                <tr key={member?.id} className="border-b border-border hover:bg-muted/30">
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <Icon name="User" size={16} className="text-primary" />
                      </div>
                      <span className="text-sm font-medium text-foreground">{member?.name}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className="text-sm text-muted-foreground">{member?.department}</span>
                  </td>
                  <td className="p-3">
                    <span className="text-sm text-foreground">{member?.workloadHours}/{member?.maxWorkload}h</span>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${
                            member?.utilization >= 90 ? 'bg-error' :
                            member?.utilization >= 75 ? 'bg-warning' : 'bg-success'
                          }`}
                          style={{ width: `${Math.min(member?.utilization, 100)}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-foreground">{member?.utilization}%</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      member?.utilization >= 90 ? 'bg-error/10 text-error' :
                      member?.utilization >= 75 ? 'bg-warning/10 text-warning' : 'bg-success/10 text-success'
                    }`}>
                      {member?.utilization >= 90 ? 'Overloaded' :
                       member?.utilization >= 75 ? 'High Load' : 'Normal'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default WorkloadSummary;