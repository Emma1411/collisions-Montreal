import HourWeekHeatmap from './HourWeekHeatmap';
import SeasonalityStrip from './SeasonalityStrip';

export default function TemporalDistribution() {
  return (
    <section aria-labelledby="titre-quand" className="card space-y-6 p-5">
      <div>
        <p className="kicker">Quand ?</p>
        <h2 id="titre-quand" className="mt-1 text-lg font-semibold tracking-tight text-ink">À quelle heure et quel jour ?</h2>
      </div>
      <HourWeekHeatmap />
      <SeasonalityStrip />
    </section>
  );
}