import { useEffect, useRef } from "react";
import * as d3 from "d3";

export default function D3Force({ graph }) {
    const ref = useRef();

    useEffect(() => {
        // Initiale Größe des Viewports
        const width = window.innerWidth;
        const height = window.innerHeight * 0.5;
        const svg = d3.select(ref.current).attr("width", width).attr("height", height);

        // Simulation mit Kräften
        const simulation = d3.forceSimulation(graph.nodes)
            .force("link", d3.forceLink(graph.links).id(d => d.id).distance(100))
            .force("charge", d3.forceManyBody().strength(-50))
            .force("center", d3.forceCenter(width / 2, height / 2))
            .force("boundary", boundaryForce()) // Grenzkraft hinzufügen
            .on("tick", ticked);

        // Linien für die Links
        const link = svg.selectAll("line")
            .data(graph.links)
            .enter().append("line")
            .attr("stroke", "#aaa");

        // Punkte für die Nodes
        const node = svg.selectAll("circle")
            .data(graph.nodes)
            .enter().append("circle")
            .attr("r", d => d.radius)
            .attr("fill", "steelblue")
            .call(drag(simulation));

        function ticked() {
            link
                .attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y);

            node
                .attr("cx", d => d.x)
                .attr("cy", d => d.y);
        }

        // Drag-Funktion
        function drag(simulation) {
            function dragstarted(event, d) {
                if (!event.active) simulation.alphaTarget(0.3).restart();
                d.fx = d.x;
                d.fy = d.y;
            }

            function dragged(event, d) {
                d.fx = event.x;
                d.fy = event.y;
            }

            function dragended(event, d) {
                if (!event.active) simulation.alphaTarget(0);
                d.fx = null;
                d.fy = null;
            }

            return d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended);
        }

        // Grenzkraft für die Punkte im SVG
        function boundaryForce() {
            return function(alpha) {
                graph.nodes.forEach(function(d) {
                    d.x = Math.max(0, Math.min(width, d.x));
                    d.y = Math.max(0, Math.min(height, d.y));
                });
            };
        }

        // Resize Event für dynamische Anpassung
        function handleResize() {
            const newWidth = window.innerWidth;
            const newHeight = window.innerHeight * 0.5;

            svg.attr("width", newWidth).attr("height", newHeight);

            // Anpassung der Kräfte
            simulation.force("center", d3.forceCenter(newWidth / 2, newHeight / 2));
            simulation.alpha(1).restart();
        }

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, [graph]);

    return <svg ref={ref} style={{ width: "100vw", height: "50vh", background: "#f0f0f0" }}></svg>;
}