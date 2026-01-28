import { Target, TrendingUp, CheckCircle2, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getGoals } from "@/app/actions/goals";
import { GoalCard } from "@/components/goals/goal-card";
import { CreateGoalButton } from "@/components/goals/create-goal-button";
import { GoalStatus } from "@/lib/types";

export default async function DashboardPage() {
  const goals = await getGoals();

  // Calculate stats
  const totalGoals = goals.length;
  const completedGoals = goals.filter((g) => g.status === GoalStatus.COMPLETED).length;
  const inProgressGoals = goals.filter((g) => g.status === GoalStatus.IN_PROGRESS).length;
  const avgProgress = totalGoals > 0
    ? Math.round(goals.reduce((sum, g) => sum + g.progress, 0) / totalGoals)
    : 0;

  const stats = [
    {
      title: "Total Goals",
      value: totalGoals,
      icon: Target,
      description: "Learning goals set",
    },
    {
      title: "In Progress",
      value: inProgressGoals,
      icon: Clock,
      description: "Currently working on",
    },
    {
      title: "Completed",
      value: completedGoals,
      icon: CheckCircle2,
      description: "Goals achieved",
    },
    {
      title: "Avg. Progress",
      value: `${avgProgress}%`,
      icon: TrendingUp,
      description: "Across all goals",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Track your learning progress and manage your goals.
          </p>
        </div>
        <CreateGoalButton />
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Goals Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Your Learning Goals</h2>
        {goals.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Target className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No goals yet</h3>
              <p className="text-muted-foreground text-center max-w-sm mb-4">
                Start your learning journey by creating your first goal. Track
                your progress and stay motivated.
              </p>
              <CreateGoalButton />
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {goals.map((goal) => (
              <GoalCard key={goal.id} goal={goal} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
